require "bcrypt"

class User < ActiveRecord::Base
    include BCrypt

    has_many :daily_reports

    has_many :watchings_to, :foreign_key => 'user_id', :class_name => 'Watching'
    has_many :watchings_from, :foreign_key => 'watching_id', :class_name => 'Watching'

    has_many :watching, :through => :watchings_to, :source => :watching
    has_many :watched_by, :through => :watchings_from, :source => :user

    validates_uniqueness_of :name

    def password
        @password ||= Password.new(encrypted_password)
    end

    def password=(new_password)
        @password = Password.create(new_password)
        self.encrypted_password = @password
    end
end