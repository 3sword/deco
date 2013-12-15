require "sinatra"
require "sinatra/activerecord"
require "./config/environments"
require "./models/user"
require "./models/daily_report"

class DecoApp < Sinatra::Application

    enable :sessions
    set :session_secret, '*&(^B234'

    def login_required!
        if session[:user].nil?
            redirect "/login.html"
        end
    end

    before do
        login_required! unless request.path_info == "/login"
        body = request.body.read
        @json = JSON.parse(body) unless body.empty?
    end

    post "/login" do
        user = User.find_by(name: @json["username"])
        if user.nil?
            status 410
        elsif user.password == @json["password"]
            session[:user] = user.id
            status 200
        else
            status 401
        end
    end

    get "/" do
        redirect "/index.html"
    end

    post "/users" do
        user = User.new
        user.name = @json[:username]
        user.password = @json[:password]
        user.save!
    end

    get "/users" do
        User.all.to_json
    end

    get "/daily_reports" do
        DailyReport.all.to_json
    end

    get "/daily_reports/:date" do
        if params[:date] == "today"
            date = Date.today
        else
            date = Date.parse(params[:date])
        end
        report = DailyReport.find_by(user_id: session[:user], date: date)
        if report.nil?
            report = DailyReport.new
            report.user_id = session[:user]
            report.date = date
            report.status = "Not created"
            report.save!
        end
        report.to_json
    end

    post "/daily_reports" do
        p @json
        date = @json["date"]
        report = DailyReport.find_by(user_id: session[:user], date: date)
        if report.nil?
            report = DailyReport.new(@json)
            report.status = "Draft"
            report.save!
            report.to_json
        elsif report.status == "Published"
            status 403
        else
            report.assign_attributes(@json)
            report.status = "Draft"
            report.save
            report.to_json
        end
    end

    get "/daily_reports/today/status" do
        report = DailyReport.find_by(user_id: session[:user], date: Date.today)
        if report.nil?
            "Not created"
        else
            report.status
        end
    end

end
