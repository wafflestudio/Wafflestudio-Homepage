class Project < ActiveRecord::Base
  has_and_belongs_to_many :members
	has_one :featured, :class_name => "Screenshot", :foreign_key => "featuring_id"
  has_many :screenshots

  attr_accessor :screenshot_files, :member_ids, :from_form, :featured_img
  after_save :add_screenshots, :set_members

  def self.available_statuses
    ['on', 'off']
  end

  def add_screenshots
    unless from_form.nil?  
			self.featured = Screenshot.create(:image => featured_img) if featured_img
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
