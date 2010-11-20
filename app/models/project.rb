class Project < ActiveRecord::Base
  has_and_belongs_to_many :members
  has_many :screenshots

  attr_accessor :screenshot_files, :member_ids, :from_form
  after_save :add_screenshots, :set_members

  def self.available_statuses
    ['on', 'off']
  end

  def add_screenshots
    unless from_form.nil?  
      (screenshot_files||[]).each{|image| self.screenshots << Screenshot.new(:image => image)}
    end
  end

  def set_members
    unless from_form.nil?  
      members.delete_all
      selected_members = (member_ids||[]).collect{|id| Member.find id}
      selected_members.each{|member| self.members << member}
    end
  end
end
