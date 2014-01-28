class AddUserEmail < ActiveRecord::Migration
    def change
        change_table(:users) do |t|
            t.string :email
        end
    end

end
