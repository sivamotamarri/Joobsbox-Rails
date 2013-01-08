class Job < ActiveRecord::Base

  belongs_to :category

  has_many :applied_resumes
  has_many :applied_users , :class_name => "Resume",   :foreign_key => "resume_id" , :through => :applied_resumes,:source => :resume
  
  attr_accessible :title,:description,:company,:category_id ,:user_id,:to_apply,:location ,
                  :is_approved ,:updated_by,:expiration_date , :status , :code_stamp

  validates :title,:description,:company,:category_id ,:user_id,:to_apply,:location , :presence => true

  extend FriendlyId
  friendly_id :title, :use => :slugged


   scope :total_postings, where(:is_approved => true)
   scope :pending_postings, where(:is_approved => false)

  before_create :cal_expiration_date

 


  def cal_expiration_date
    self.expiration_date = Time.now + (Setting.first.job_expr_date_days || 30).days
  end

  

  searchable do
    text :title, :description , :location , :company
    boolean :is_approved
    time    :created_at
    time    :expiration_date
  end

end

#
#+-----------------+--------------+------+-----+---------+----------------+
#| Field           | Type         | Null | Key | Default | Extra          |
#+-----------------+--------------+------+-----+---------+----------------+
#| id              | int(11)      | NO   | PRI | NULL    | auto_increment |
#| title           | varchar(255) | YES  |     | NULL    |                |
#| description     | text         | YES  |     | NULL    |                |
#| company         | varchar(255) | YES  |     | NULL    |                |
#| category_id     | int(11)      | YES  |     | NULL    |                |
#| user_id         | int(11)      | YES  |     | NULL    |                |
#| to_apply        | varchar(255) | YES  |     | NULL    |                |
#| location        | varchar(255) | YES  |     | NULL    |                |
#| is_approved     | tinyint(1)   | YES  |     | NULL    |                |
#| updated_by      | int(11)      | YES  |     | NULL    |                |
#| expiration_date | datetime     | YES  |     | NULL    |                |
#| status          | tinyint(1)   | YES  |     | NULL    |                |
#| code_stamp      | datetime     | YES  |     | NULL    |                |
#| created_at      | datetime     | NO   |     | NULL    |                |
#| updated_at      | datetime     | NO   |     | NULL    |                |
#+-----------------+--------------+------+-----+---------+----------------+
