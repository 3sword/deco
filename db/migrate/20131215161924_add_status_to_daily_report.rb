class AddStatusToDailyReport < ActiveRecord::Migration
  def change
    add_column :daily_reports, :status, :string
  end
end
