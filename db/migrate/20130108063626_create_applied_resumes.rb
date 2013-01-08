class CreateAppliedResumes < ActiveRecord::Migration
  def change
    create_table :applied_resumes do |t|
      t.integer :resume_id
      t.integer :job_id
      t.text :covering_letter
      t.date :applied_date
      t.timestamps
    end
  end
end
