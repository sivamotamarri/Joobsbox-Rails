class Role < ActiveRecord::Base
  has_and_belongs_to_many :users, :join_table => :users_roles
  belongs_to :resource, :polymorphic => true
  attr_accessible :name
  validates :name,
        :length => { :minimum => 2, :maximum => 24, :message => "has invalid length"},
        :presence => {:message => "can't be blank"}
      
  scopify
end
