class DailyReport < ActiveRecord::Base
    belongs_to :user

    validates_presence_of :date
    validates_uniqueness_of :date, :scope => :user_id
end
