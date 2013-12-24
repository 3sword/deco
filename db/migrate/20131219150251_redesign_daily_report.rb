class RedesignDailyReport < ActiveRecord::Migration
    def change
        change_table(:daily_reports) do |t|
            t.remove :commitment, :plan, :problem
            t.text :content
        end
    end
end
