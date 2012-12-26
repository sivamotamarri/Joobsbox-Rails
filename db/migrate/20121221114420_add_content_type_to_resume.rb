class AddContentTypeToResume < ActiveRecord::Migration
  def change
    add_column :resumes, :content_type , :string
    add_column :resumes, :filename , :string
  end
end
