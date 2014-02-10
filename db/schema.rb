# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140210061629) do

  create_table "daily_reports", force: true do |t|
    t.integer  "user_id"
    t.date     "date"
    t.string   "status"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "content"
  end

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "realname"
    t.string   "encrypted_password"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "email"
  end

  add_index "users", ["name"], name: "index_users_on_name", unique: true

  create_table "watchings", force: true do |t|
    t.integer "user_id",                     null: false
    t.integer "watching_id",                 null: false
    t.boolean "mailing",     default: false
  end

end
