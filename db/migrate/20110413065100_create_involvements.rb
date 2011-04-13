class CreateInvolvements < ActiveRecord::Migration
  def self.up
    create_table :involvements do |t|
			t.integer :member_id
			t.integer :project_id
			t.string :status, :default => 'current'
      t.timestamps
    end
  end

  def self.down
    drop_table :involvements
  end
end
