class AddIsVisibleToProject < ActiveRecord::Migration
  def change
    add_column :projects, :is_visible, :boolean, default: true
  end
end
