class Contact < ActiveRecord::Base

  def self.available_statuses
    ['unread', 'read', 'done']
  end
end
