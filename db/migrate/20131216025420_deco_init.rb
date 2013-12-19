
require 'bcrypt'


class DecoInit < ActiveRecord::Migration

  def change
    create_table :users do |t|
      t.string :name
      t.string :realname
      t.string :encrypted_password
      t.timestamps
    end
    add_index :users, :name, :unique => true

    create_table :daily_reports do |t|
      t.belongs_to :user
      t.date :date
      t.text :commitment
      t.text :plan
      t.text :problem
      t.string :status
      t.timestamps
    end
  end

end

