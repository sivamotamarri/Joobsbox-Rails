class User < ActiveRecord::Base
  rolify

  has_and_belongs_to_many :groups, :join_table => :users_groups

  has_many :resumes
  has_many :jobs

  has_many :applied_resumes
  has_many :applied_jobs , :class_name => "Job",   :foreign_key => "job_id" , :through => :applied_resumes ,:source => :job

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

  def can_create?(groups,model_name)
    perm = groups.first.permissions.find_by_joobs_model_name(model_name)
      if perm
        if perm.m.blank?
          if perm.c.blank?
           raise CanCan::AccessDenied, "Not authorized to create a #{model_name}."
          end
        end
      end
  end

  def can_delete?(groups,model_name)
    perm = groups.first.permissions.find_by_joobs_model_name(model_name)
      if perm
        if perm.m.blank?
          if perm.d.blank?
           raise CanCan::AccessDenied, "Not authorized to delete a #{model_name}."
          end
        end
      end
  end

  def can_update?(groups,model_name)
      perm = groups.first.permissions.find_by_joobs_model_name(model_name)
      if perm
        if perm.m.blank?
          if perm.u.blank?
           raise CanCan::AccessDenied, "Not authorized to update a #{model_name}."
          end
        end
      end
  end

  def can_read?(groups,model_name)
     perm = groups.first.permissions.find_by_joobs_model_name(model_name)
      if perm
        if perm.m.blank?
          if perm.r.blank?
           raise CanCan::AccessDenied, "Not authorized to read a #{model_name}."
          end
        end
      end
  end
end
