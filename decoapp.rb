require "sinatra"
require "sinatra/namespace"
require "sinatra/activerecord"
require "sidekiq"
require "./config/environments"
require "./models/user"
require "./models/daily_report"
require "./models/watching"
require "./models/group"
require "./models/users_group"


class SendMailWorker
    include Sidekiq::Worker
    sidekiq_options :queue => :deco
    def perform(recipient, subject_content, body_content, username, date)
        Mail.deliver do
            from 'deco@hr-server.cn.workslan'
            to recipient
            subject subject_content
            body body_content + "\n\nView on DECO: http://hr-server.cn.workslan:3000/#/published_daily_reports/#{username}/#{date}"
        end
    end
end

class DecoApp < Sinatra::Application

    register Sinatra::Namespace
    set :index_page, File.read(File.join(settings.public_folder, 'deco.html'))
    set :daily_report_template, File.read("resources/daily_report_template.md")

    get "/" do
        if session[:user].nil?
            user_id = nil
        else
            user_id = session[:user][:id]
        end
        response.set_cookie("userid", {
            :value => user_id,
            :httponly => false
        })
        settings.index_page
    end

    namespace '/api' do
        def login_required!
            halt 401 if session[:user].nil?
        end

        before do
            login_required! unless ["/api/login", "/api/signup"].include?(request.path_info)
            body = request.body.read
            unless body.empty?
                @json = JSON.parse(body)
                @json.delete("created_at")
                @json.delete("updated_at")
            end
        end

        get "/login" do
            user = User.find(params[:userid])
            if user.nil?
                status 404
            else
                user.to_json(:except => :encrypted_password)
            end
        end

        post "/login" do
            session[:user] = nil
            user = User.find_by(name: @json["username"])
            if user.nil?
                status 410
            elsif user.password == @json["password"]
                session[:user] = {:id => user.id, :name => user.name}
                user.to_json(:except => :encrypted_password)
            else
                status 401
            end
        end

        post "/logout" do
            session.clear
            status 200
        end

        post "/signup" do
            user = User.find_by(name: @json["username"])
            halt 409 unless user.nil?

            user = User.new
            user.name = @json["username"]
            user.realname = @json["realname"]
            user.password = @json["password"]
            user.save!
            session[:user] = {:id => user.id, :name => user.name}
            user.to_json(:except => :encrypted_password)
        end

        get "/users" do
            User.all.to_json(:except => :encrypted_password)
        end

        post "/users" do
            halt 403 if @json["id"] != session[:user][:id]
            user = User.find(@json["id"])
            if @json["newpassword"]
                halt 403 if user.password != @json["password"]
                user.password = @json["newpassword"]
            end
            @json.delete("password")
            @json.delete("newpassword")
            user.assign_attributes(@json)
            user.save!
            user.to_json(:except => :encrypted_password)
        end

        get "/published_daily_reports/:username/:date" do
            report = User.find_by(name: params[:username]).daily_reports.published.find_by(date: params[:date])
            if report.nil?
                404
            else
                report.to_json
            end
        end

        get "/published_daily_reports" do
            reports = DailyReport.published.watched_by(User.find(session[:user][:id]))
            reports = reports.where(:user_id => params[:userid]) unless params[:userid].nil?
            if params[:period].nil?
                reports = reports.updated_today.order('updated_at DESC')
            else
                now = Time.now
                case params[:period]
                when "tweek"
                    from = now.beginning_of_week
                    to = now.end_of_week
                when "lweek"
                    from = now.beginning_of_week.weeks_ago(1)
                    to = now.end_of_week.weeks_ago(1)
                when "tmonth"
                    from = now.beginning_of_month
                    to = now.end_of_month
                when "lmonth"
                    from = now.beginning_of_month.months_ago(1)
                    to = now.end_of_month.months_ago(1)
                end
                reports = reports.where(:date => from..to).order('date')
            end
            reports.to_json(:include => {:user => {:only => [:realname, :name]}})
        end

        get "/my_daily_reports/:date" do
            if params[:date] == "today"
                date = Date.today
            else
                date = Date.parse(params[:date])
            end
            report = DailyReport.find_by(user_id: session[:user][:id], date: date)
            if report.nil?
                report = DailyReport.new
                report.user_id = session[:user][:id]
                report.content = settings.daily_report_template
                report.date = date
                report.status = "Not created"
                report.save!
            end
            report.to_json
        end

        post "/my_daily_reports" do
            halt 403 if @json["user_id"] != session[:user][:id]
            if params[:publish]
                status = "Published"
            else
                status = "Draft"
            end
            date = @json["date"]
            user = User.find(session[:user][:id])
            report = user.daily_reports.find_by(date: date)
            if report.nil?
                report = DailyReport.new(@json)
                report.status = status
                report.save!
                report.to_json
            elsif report.status == "Published"
                status 403
            else
                report.assign_attributes(@json)
                report.status = status
                report.save
                #sendmail
                if status == "Published"
                    user.watchings_from.mailing.each do |watching|
                        addr = watching.user.email
                        SendMailWorker.perform_async(addr, "#{user.realname} published report of #{report.date}", report.content, user.name, report.date) unless addr.nil? || addr.empty?
                    end
                end
                report.to_json
            end
        end

        get "/my_watchings" do
            user = User.find(session[:user][:id])
            result = Hash.new
            result["watched"] = user.watchings_to.map{ |item|
                user_hash = item.watching.serializable_hash(:except => :encrypted_password)
                user_hash["mailing"] = item.mailing
                user_hash
            }
            result["unwatched"] = (User.all - user.watching - [user]).map { |item|
                item.serializable_hash(:except => :encrypted_password)
            }
            result.to_json
        end

        #toggle mailing
        put "/my_watchings/:user_id" do
            user = User.find(session[:user][:id])
            watching = user.watchings_to.find_by(:watching_id => params[:user_id])
            watching.mailing = !watching.mailing
            watching.save
            status 200
        end

        #add watching
        post "/my_watchings" do
            user = User.find(session[:user][:id])
            watching = Watching.new
            watching.user_id = user.id
            watching.watching_id = @json["id"]
            watching.save
            status 200
        end

        #remove watching
        delete "/my_watchings/:user_id" do
            user = User.find(session[:user][:id])
            watching = Watching.find_by(:user_id => user.id, :watching_id => params[:user_id])
            watching.destroy
        end

        get "/groups" do
            user = User.find(session[:user][:id])
            if user.nil?
                halt 403
            end
            groups = user.groups
            groups.to_json(:only => [:name])
        end

        post "/groups" do
            name = @json["name"]
            owner = session[:user][:id]
            Group.create(name: name, owner_id: owner)
            status 200
        end

        get "/groups/:group" do
            group = Group.find_by(name: params[:group])

            {
                :name => group.name,
                :owner => User.find(group.owner_id).name,
                :created_at => group.created_at
            }.to_json
        end

        post "/groups/:group" do
            name = @json["name"]
            owner = @json["owner"]

            group = Group.find_by(name: params[:group])
            user = User.find_by(name: owner)

            group.name = name unless name.nil?
            group.owner_id = user.id unless user.nil?

            status 200 
        end

        get "/groups/:group/users" do
            group = Group.find_by(name: params[:group])

            group.users.to_json(:only => [:name])
        end

        post "/groups/:group/users" do
            name = @json["name"]
            group = Group.find_by(name: params[:group])
            user = User.find_by(name: name)

            UsersGroup.create(user_id: user.id, group_id: group.id) unless user.nil?

            status 200
        end

        get "/groups/:group/today" do
            group = Group.find_by(name: params[:group])
            published_users = Array.new

            reports = group.users.map do |user|
                today_report = user.daily_reports.updated_today.published

                report = { :name => user.name }
                report[:published] = !today_report.empty?
                report[:time] = today_report[0].created_at unless today_report.empty?

                report
            end

            reports.to_json
        end
    end

end
