class AddSubtitleToProject < ActiveRecord::Migration
  def self.up
    add_column :projects, :subtitle, :string
  end

  def self.down
    remove_column :projects, :subtitle
  end
end
