class User < ActiveRecord::Base
  rolify

  has_and_belongs_to_many :groups, :join_table => :users_groups

  has_many :resumes
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :role_ids, :as => :admin
  attr_accessible :email, :password, :password_confirmation, :remember_me , :name , :role_name
  attr_accessor :role_name
  # attr_accessible :title, :body

  after_create :role_to_user

  extend FriendlyId
  friendly_id :name, :use => :slugged

  
  
  def role_to_user
    self.add_role self.role_name
  end

  def grouped_to?(group_name)
    groups.where(:name => group_name).size > 0
  end

end
