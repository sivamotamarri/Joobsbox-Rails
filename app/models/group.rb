class Group < ActiveRecord::Base
   attr_accessible :name, :status
   has_and_belongs_to_many :users, :join_table => :users_groups

   has_many :permissions
   
   attr_accessible :user_ids

  def add_user(user)
     self.users << (user)
  end

  def remove_user(user)
    self.users.delete(user)
  end
end
