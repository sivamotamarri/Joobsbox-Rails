class CreateResumes < ActiveRecord::Migration
  def change
    create_table :resumes do |t|
      t.string :nationality
      t.string :current_location
      t.string :mobile_number
      t.string :landline
      t.string :gender
      t.integer :user_id
      t.integer :total_experience_yrs
      t.integer :total_experience_mns
  
      t.string   :current_industry
      t.string   :function
      
      t.string :key_skills

      t.string   :resume_title
      t.string   :attachment
      t.timestamps
    end
  end
end
