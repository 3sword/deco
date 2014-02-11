class CreateWatching < ActiveRecord::Migration
  def change
    create_table(:watchings) do |t|
        t.integer "user_id", :null => false
        t.integer "watching_id", :null => false
        t.boolean "mailing", :default => false
    end
  end
end
