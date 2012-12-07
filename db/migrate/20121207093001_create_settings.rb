class CreateSettings < ActiveRecord::Migration
  def change
    create_table :settings do |t|
      
      t.integer :jobs_per_cat , :default => 10
      t.string :site_title , :default => "Joobsbox"
      t.integer :job_expr_date_days , :default =>  30
      t.string :timezone , :default => ''

      t.integer :rss_in_gen , :default => 15
      t.integer :rss_per_cat , :default =>  15
      
      t.timestamps
    end
  end
end
