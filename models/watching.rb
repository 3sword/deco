class Watching < ActiveRecord::Base
    belongs_to :user, :class_name => 'User', :foreign_key => 'user_id'
    belongs_to :watching, :class_name => 'User', :foreign_key => 'watching_id'
end