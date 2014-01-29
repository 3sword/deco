require "sinatra"
require "sinatra/namespace"
require "sinatra/activerecord"
require "./config/environments"
require "./models/user"
require "./models/daily_report"
require "./models/user_group"
require "./models/user_group_member"

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
                user.to_json(:except => :encrypted_password, :include => :user_groups)
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
            reports = DailyReport.published
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

        #get "/userGroups" do
        #    #UserGroup.all.to_json
        #    rs = {}
        #    UserGroupMember.all.each do |group_member|
        #        gid = group_member.user_group_id
        #        uid = group_member.user_id
        #        group_name = UserGroup.find(gid).name
        #        user_name = User.find(uid).name
        #        p group_name
        #        p user_name
        #        if rs[group_name].nil?
        #            rs[group_name] = []
        #        end
        #        rs[group_name].push(user_name)
        #        p rs
        #    end
        #    rs.to_json
        #end

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
            report = DailyReport.find_by(user_id: session[:user][:id], date: date)
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
                report.to_json
            end
        end
    end

end
