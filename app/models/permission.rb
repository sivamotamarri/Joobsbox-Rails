class Permission < ActiveRecord::Base
   attr_accessible :group_id, :r , :c , :u , :d , :m , :limited , :joobs_model_name
   attr_accessor  :limited
   
   validates :group_id ,:joobs_model_name, :presence => true
   validates :m , :presence => {:message => "Permissions should be 'all' or 'limited'" , :if => Proc.new {|perm| perm.limited.blank? }}
   
   validates :limited , :presence => {:message => "Select atleast one of the following permissions" , :if => Proc.new {|perm| perm.m.blank? }}
 

  belongs_to :group
  
end

#
#+------------------+--------------+------+-----+---------+----------------+
#| Field            | Type         | Null | Key | Default | Extra          |
#+------------------+--------------+------+-----+---------+----------------+
#| id               | int(11)      | NO   | PRI | NULL    | auto_increment |
#| group_id         | int(11)      | YES  |     | NULL    |                |
#| joobs_model_name | varchar(255) | YES  |     | NULL    |                |
#| r                | varchar(255) | YES  |     | NULL    |                |
#| c                | varchar(255) | YES  |     | NULL    |                |
#| u                | varchar(255) | YES  |     | NULL    |                |
#| d                | varchar(255) | YES  |     | NULL    |                |
#| m                | varchar(255) | YES  |     | NULL    |                |
#| created_at       | datetime     | NO   |     | NULL    |                |
#| updated_at       | datetime     | NO   |     | NULL    |                |
#+------------------+--------------+------+-----+---------+----------------+
