class RedesignDailyReport < ActiveRecord::Migration
    def change
        change_table(:daily_reports) do |t|
            t.remove :commitment, :plan, :problem
            t.string :content
        end
    end
end
