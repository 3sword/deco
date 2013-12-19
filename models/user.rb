require "bcrypt"

class User < ActiveRecord::Base
    include BCrypt

    has_many :daily_reports
    has_many :user_group_members
    has_many :user_groups, through: :user_group_members

    validates_uniqueness_of :name

    def password
        @password ||= Password.new(encrypted_password)
    end

    def password=(new_password)
        @password = Password.create(new_password)
        self.encrypted_password = @password
    end
end
