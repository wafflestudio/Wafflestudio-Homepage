class Project < ActiveRecord::Base
  has_many :involvements
	has_many :members, :through => :involvements, :conditions => "involvements.status = 'current'"
	has_many :prev_members, :through => :involvements, :source => :member, :conditions => "involvements.status = 'previous'" do
		def <<(prev_member)
			Involvement.send(:with_scope, :create => {:status => 'previous'}) {self.concat prev_member}
		end
	end
	has_one :featured, :class_name => "Screenshot", :foreign_key => "featuring_id"
	has_one :logo, :class_name => "Screenshot", :foreign_key => "logo_of_id"
  has_many :screenshots

  attr_accessor :screenshot_files, :member_ids, :prev_member_ids, :from_form, :featured_img, :logo_img
  after_save :add_screenshots, :set_members

  def self.available_statuses
    ['on', 'off']
  end

  def add_screenshots
    unless from_form.nil?  
			self.featured = Screenshot.create(:image => featured_img) if featured_img
			self.logo = Screenshot.create(:image => logo_img) if logo_img
      (screenshot_files||[]).each{|image| self.screenshots << Screenshot.new(:image => image)}
    end
  end

  def set_members
    unless from_form.nil?  
      members.delete_all
      selected_members = (member_ids||[]).collect{|id| Member.find id}
      selected_members.each{|member| self.members << member}
      prev_members.delete_all
      selected_prev_members = (prev_member_ids||[]).collect{|id| Member.find id}
      selected_prev_members.each{|member| self.prev_members << member}
    end
  end
end
