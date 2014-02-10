class DailyReport < ActiveRecord::Base

    scope :published, -> { where(status: "Published") }
    scope :updated_today, -> { where("updated_at >= ?", Time.now.beginning_of_day) }
    scope :watched_by, ->(user) { where("user_id in (?)", user.watching.collect(&:id) + [user.id]) }
    belongs_to :user

    validates_presence_of :date
    validates_uniqueness_of :date, :scope => :user_id
end
