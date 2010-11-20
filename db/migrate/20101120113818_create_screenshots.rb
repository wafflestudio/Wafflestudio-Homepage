class CreateScreenshots < ActiveRecord::Migration
  def self.up
    create_table :screenshots do |t|
      t.integer :project_id
      t.string :image_file_name
      t.string :image_content_type

      t.timestamps
    end
  end

  def self.down
    drop_table :screenshots
  end
end
