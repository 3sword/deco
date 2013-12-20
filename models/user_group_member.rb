

class UserGroupMember < ActiveRecord::Base

    belongs_to :user
    belongs_to :user_group

    ## one user can present only once in the same group
    validates_uniqueness_of :user_id, scope: :user_group_id
end
