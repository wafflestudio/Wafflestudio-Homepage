class AddFeaturingIdToScreenshot < ActiveRecord::Migration
  def self.up
		add_column :screenshots, :featuring_id, :integer
  end

  def self.down
		remove_column :screenshots, :featuring_id
  end
end
