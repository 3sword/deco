class AddUserGroup < ActiveRecord::Migration
  def change
  	create_table :groups do |t|
  		t.string :name, null: false
  		t.integer :owner_id, null: false

  		t.timestamps
  	end

  	create_table :users_groups do |t|
  		t.integer :user_id, null: false
  		t.integer :group_id, null: false

  		t.timestamps
  	end

  	add_index :users_groups, :user_id
  end
end
