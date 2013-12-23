require "sinatra"
require "sinatra/namespace"
require "sinatra/activerecord"
require "./config/environments"
require "./models/user"
require "./models/daily_report"

class DecoApp < Sinatra::Application
    register Sinatra::Namespace
    enable :sessions
    set :index_page, File.read(File.join(settings.public_folder, 'deco.html'))
    set :daily_report_template, File.read("resources/daily_report_template.md")

    get "/" do
        if session[:user].nil?
            username = nil
        else
            username = session[:user][:name]
        end
        response.set_cookie("username", {
            :value => username,
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
            @json = JSON.parse(body) unless body.empty?
        end

        post "/login" do
            session[:user] = nil
            user = User.find_by(name: @json["username"])
            if user.nil?
                status 410
            elsif user.password == @json["password"]
                session[:user] = {:id => user.id, :name => user.name}
                user.name
            else
                status 401
            end
        end

        post "/signup" do
            user = User.find_by(name: @json["username"])
            halt 409 unless user.nil?

            user = User.new
            user.name = @json["username"]
            user.password = @json["password"]
            user.save!
            session[:user] = {:id => user.id, :name => user.name}
            user.name
        end

        get "/users" do
            User.all.to_json
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
            DailyReport.published.updated_today.order('updated_at DESC').to_json(:include => {:user => {:only => :name}})
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
