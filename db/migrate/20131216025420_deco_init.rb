
require 'bcrypt'


class DecoInit < ActiveRecord::Migration

  def change
    create_table :users do |t|
      t.string :name
      t.string :encrypted_password
      t.timestamps
    end
    add_index :users, :name, :unique => true, :using => :hash

    create_table :daily_reports do |t|
      t.belongs_to :user
      t.date :date
      t.text :commitment
      t.text :plan
      t.text :problem
      t.string :status
      t.timestamps
    end

    User.create(name: "liu", encrypted_password: BCrypt::Password.create("liu"));
    User.create(name: "feng", encrypted_password: BCrypt::Password.create("feng"));
  end


  def up
  end

  def down
  end
end

