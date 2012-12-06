class User < ActiveRecord::Base
  rolify
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me , :name , :role_name
  attr_accessor :role_name
  # attr_accessible :title, :body

  after_create :role_to_user



  
  
  def role_to_user
    self.add_role self.role_name
  end


end
