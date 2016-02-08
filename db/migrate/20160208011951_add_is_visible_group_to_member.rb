class AddIsVisibleGroupToMember < ActiveRecord::Migration
  def change
    add_column :members, :is_visible, :boolean, default: true
    add_column :members, :group, :integer
  end
end
