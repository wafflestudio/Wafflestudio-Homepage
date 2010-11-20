class CreateMembers < ActiveRecord::Migration
  def self.up
    create_table :members do |t|
      t.string :name, :null => false
      t.string :name_eng
      t.string :tags, :default => ''
      t.string :school, :default => ''
      t.string :email, :default => ''
      t.string :website, :default => ''
      t.string :twitter, :default => ''
      t.text :comment, :default => ''

      t.string :resume_file_name
      t.string :resume_content_type

      t.string :list1_file_name
      t.string :list1_content_type

      t.string :list2_file_name
      t.string :list2_content_type

      t.string :profile_file_name
      t.string :profile_content_type

      t.timestamps
    end
  end

  def self.down
    drop_table :members
  end
end
