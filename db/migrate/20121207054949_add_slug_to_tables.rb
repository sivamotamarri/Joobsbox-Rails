class AddSlugToTables < ActiveRecord::Migration
  def change
    add_column :users, :slug , :string
    add_column :jobs, :slug , :string
    add_column :categories, :slug , :string
  end
end
