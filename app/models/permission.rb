class Permission < ActiveRecord::Base
   attr_accessible :group_id, :r , :c , :u , :d , :m

  belongs_to :group
  
end
