class CreateProjects < ActiveRecord::Migration
  def self.up
    create_table :projects do |t|
      t.string :name
      t.text :description
      t.date :start_date
      t.string :status, :default => 'on'
      t.string :link

      t.timestamps
    end
  end

  def self.down
    drop_table :projects
  end
end
