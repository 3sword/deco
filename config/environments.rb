require 'mail'

configure :development do
    set :database, "sqlite3:///db/deco.sqlite3"
    set :session_secret, '*&(^B234'
    Mail.defaults do
        delivery_method :sendmail, :location => '/usr/bin/sendmail'
    end
end

configure :production do
    set :database, "postgres://postgres:postgres@localhost/deco"
    Mail.defaults do
        delivery_method :sendmail, :location => '/usr/bin/sendmail'
    end
end