class Member < ActiveRecord::Base
  has_and_belongs_to_many :projects
  serialize :tags
  serialize :skills
  attr_accessor :project_ids, :tag_names, :skill_inputs, :from_form
  before_save :set_tags, :set_skills
  after_save :set_projects

  has_attached_file :resume
  has_attached_file :profile, :styles => { :actual => "230x480>", :thumb => "100x100>" }
  has_attached_file :list1, :styles => { :thumb => "61x61" }
  has_attached_file :list2, :styles => { :thumb => "100x100>" }

  def set_tags
    unless from_form.nil?
      self.tags = tag_names||[]
    end
    true
  end

  def set_skills
    unless from_form.nil?
      self.skills = skill_inputs.reject{|skill| skill[:name] == ''}||[]
    end
  end

  def set_projects
    unless from_form.nil?
      projects.delete_all
      selected_projects = (project_ids||[]).collect{|id| Project.find id}
      selected_projects.each{|project| self.projects << project }
    end
  end

  def self.available_tags
    ['Web Development', 'Visual Design', 'Strategy', 'User Experience', 'iOS Development', 'Android Development', 'Head']
  end

  def self.tag_color
    colors = ['#DE2F12', '#D01351', '#D4790D', '#0A86CD', '#000000', '#62C00E', 'violet']
    Hash[*(self.available_tags).zip(colors).flatten]
  end

end
