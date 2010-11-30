class CreateContacts < ActiveRecord::Migration
  def self.up
    create_table :contacts do |t|
      t.string :name
      t.string :email
      t.string :phone
      t.text :message
      t.string :status, :default => 'unread'
      t.string :mail_status, :default => 'unsent'

      t.timestamps
    end
  end

  def self.down
    drop_table :contacts
  end
end
