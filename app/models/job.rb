class Job < ActiveRecord::Base
  attr_accessible :title,:description,:company,:category_id ,:user_id,:to_apply,:location ,
                  :is_approved ,:updated_by,:expiration_date , :status , :code_stamp


  extend FriendlyId
  friendly_id :title, :use => :slugged
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
