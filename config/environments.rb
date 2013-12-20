configure :development do
    set :database, "sqlite3:///db/deco.sqlite3"
end

configure :production do
    set :database, "postgres://postgres:postgres@localhost/deco"
end