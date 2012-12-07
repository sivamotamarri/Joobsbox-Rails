class CreateJobs < ActiveRecord::Migration
  def change
    create_table :jobs do |t|
      t.string   :title
      t.text   :description
      t.string   :company
      t.integer  :category_id
      t.integer  :user_id
      t.string   :to_apply
      t.string   :location
      t.boolean  :is_approved
      t.integer  :updated_by
      t.datetime :expiration_date
      t.boolean  :status
      t.datetime :code_stamp
      t.timestamps
    end
  end
end
