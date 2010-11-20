class CreateMembersProjects < ActiveRecord::Migration
  def self.up
    create_table :members_projects, :id=>false do |t|
      t.integer :member_id
      t.integer :project_id
    end
  end

  def self.down
    drop_table :members_projects
  end
end
