
require 'bcrypt'

class CreateUserGroups < ActiveRecord::Migration

    def change
        create_table :user_groups do |t|
            t.string :name
            ## 0: tobe cleanup, 1: temporary disable, 2: normal
            t.integer :status, :null => false, :default => 2  
            t.timestamps
        end
        add_index :user_groups, :name, :unique => true, :using => :hash

        create_table :user_group_members do |t|
            t.belongs_to :user_group, :null => false
            t.belongs_to :user,       :null => false
            ## 0: tobe cleanup, 1: normal, 2: manager
            t.integer :role, :null => false, :default => 1
            t.timestamps
        end
    end

end

