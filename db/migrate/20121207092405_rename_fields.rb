class RenameFields < ActiveRecord::Migration
 change_table :jobs do |t|
   t.remove :is_approved , :status
   t.boolean  :is_approved , :default => false
   t.boolean  :status , :default => false
  end
end
