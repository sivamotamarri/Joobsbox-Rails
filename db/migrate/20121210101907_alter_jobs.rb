class AlterJobs < ActiveRecord::Migration
 change_table :jobs do |t|
   t.remove :expiration_date
   t.date :expiration_date
  end
end
