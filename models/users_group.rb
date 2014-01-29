class UsersGroup < ActiveRecord::Base
	belongs_to :user
	belongs_to :group

	scope :with_group, ->(group) { where(group_id: group.id)}
	scope :with_user, ->(user) { where(user_id: user.id)}

	validates_presence_of :user_id
	validates_presence_of :group_id
	validates :user_id, uniqueness: { scope: [:group_id], message: "already exists in group" }
end