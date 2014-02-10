class Watching < ActiveRecord::Migration
  def change
    create_table :watchings do |t|
        t.column "user_id", :integer, :null => false
        t.column "watching_id", :integer, :null => false
    end
  end
end
