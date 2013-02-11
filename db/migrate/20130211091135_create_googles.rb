class CreateGoogles < ActiveRecord::Migration
  def change
    create_table :googles do |t|
      t.attachment :avatar
      t.timestamps
    end
  end
end
