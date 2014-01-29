class Group < ActiveRecord::Base
	has_many :users_groups, dependent: :destroy
	has_many :users, through: :users_groups

	validates_uniqueness_of :name
end