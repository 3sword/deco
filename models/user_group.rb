
class UserGroup < ActiveRecord::Base

    has_many :user_group_members
    has_many :users, through: :user_group_members

    validates_uniqueness_of :name

end
