class AddLogoOfIdToScreenshot < ActiveRecord::Migration
  def self.up
    add_column :screenshots, :logo_of_id, :integer
  end

  def self.down
    remove_column :screenshots, :logo_of_id
  end
end
