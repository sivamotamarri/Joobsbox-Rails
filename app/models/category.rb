class Category < ActiveRecord::Base

  has_many :jobs

  has_many  :approved_jobs, :class_name => 'Job', :conditions => ['is_approved = ?', true]
  
  extend FriendlyId
  friendly_id :name, :use => :slugged
  
  acts_as_tree :order => "name"
  
  attr_accessible :name, :link , :order_index , :parent_id

  scope :root_nodes, where(:parent_id => 0)


end

#+-------------+--------------+------+-----+---------+----------------+
#| Field       | Type         | Null | Key | Default | Extra          |
#+-------------+--------------+------+-----+---------+----------------+
#| id          | int(11)      | NO   | PRI | NULL    | auto_increment |
#| name        | varchar(255) | YES  |     | NULL    |                |
#| link        | varchar(255) | YES  |     | NULL    |                |
#| order_index | int(11)      | YES  |     | NULL    |                |
#| parent_id   | int(11)      | YES  |     | NULL    |                |
#| lft         | int(11)      | YES  |     | NULL    |                |
#| rgt         | int(11)      | YES  |     | NULL    |                |
#| depth       | int(11)      | YES  |     | NULL    |                |
#| created_at  | datetime     | NO   |     | NULL    |                |
#| updated_at  | datetime     | NO   |     | NULL    |                |
#+-------------+--------------+------+-----+---------+----------------+
