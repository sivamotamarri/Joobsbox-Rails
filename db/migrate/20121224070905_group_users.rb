class GroupUsers < ActiveRecord::Migration
  def change
    create_table(:users_groups, :id => false) do |t|
      t.references :user
      t.references :group
    end
    add_index(:users_groups, [ :user_id, :group_id ])
  end  
end
