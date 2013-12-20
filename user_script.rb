require "sinatra"
require "sinatra/namespace"
require "sinatra/activerecord"
require "./config/environments"
require "./models/user"
require "./models/user_group"
require "./models/user_group_member"


group_names = ["cjk", "deco"]
user_names = ["fengzh", "liu", "yangling", "hanxiao"]
group_members = {
    "deco"=> ["fengzh", "liu", "yangling", "hanxiao"],
    "cjk" => ["liu"]
}


group_names.each do |n|
    g = UserGroup.new
    g.name = n
    g.save!
end


user_names.each do |n|
    user = User.new
    user.name = n
    user.password = n
    user.save!
end


group_members.each do |group_name, user_names|
    gid = UserGroup.find_by(name: group_name).id
    user_names.each do |n|
        uid = User.find_by(name: n).id
        group_member = UserGroupMember.new(user_id: uid, user_group_id: gid)
        group_member.save!
    end
end


