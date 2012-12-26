class AddStatusToResumes < ActiveRecord::Migration
  def change
    add_column :resumes, :status , :boolean , :default => true
  end
end
