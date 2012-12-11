class CreateThemes < ActiveRecord::Migration
  def change
    create_table :themes do |t|
      t.string :name
      t.string :template_screen_shot
      t.boolean :is_active , :default => false
      t.timestamps
    end
  end
end
