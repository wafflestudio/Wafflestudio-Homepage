class AddGradeToMember < ActiveRecord::Migration
  def self.up
    add_column :members, :grade, :string, :default => 'cream'
  end

  def self.down
    remove_column :members, :grade
  end
end
