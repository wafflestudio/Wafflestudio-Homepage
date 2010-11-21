class CreateCarousels < ActiveRecord::Migration
  def self.up
    create_table :carousels do |t|
      t.string :visibility, :default => 'visible'
      t.string :c_image_file_name
      t.string :c_image_content_type
      t.string :action

      t.timestamps
    end
  end

  def self.down
    drop_table :carousels
  end
end
