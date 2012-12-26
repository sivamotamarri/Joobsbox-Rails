class CreatePermissions < ActiveRecord::Migration
  def change
    create_table :permissions do |t|
      t.integer :group_id
      t.string  :joobs_model_name
      t.string  :r
      t.string  :c
      t.string  :u
      t.string  :d
      t.string  :m
      t.timestamps
    end
  end
end
