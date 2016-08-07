class Member < ApplicationRecord
  has_many :involvements
  has_many :projects, -> {where(:involvements => {:status => 'current'})}, :through => :involvements
  has_many :prev_projects, -> {where(:involvements => {:status => 'previous'})}, :source => :project, :through => :involvements do
    def <<(prev_project)
      Involvement.where(:status => 'previous').scoping {self.concat prev_project}
    end
  end

  serialize :tags
  serialize :skills
  attr_accessor :project_ids, :prev_project_ids, :tag_names, :skill_inputs, :from_form
  before_save :set_tags, :set_skills
  after_save :set_projects

  default_scope { order(:group, :id) }

  has_attached_file :resume
  has_attached_file :profile, :styles => { :actual => "230x480>", :thumb => "100x100>" }
  has_attached_file :list1, :styles => { :thumb => "61x61", :small => "25x25" }
  has_attached_file :list2, :styles => { :thumb => "100x100>" }
  validates_attachment_content_type :resume, :content_type => /\Aapplication\/.*\Z/
  validates_attachment_content_type :profile, :content_type => /\Aimage\/.*\Z/
  validates_attachment_content_type :list1, :content_type => /\Aimage\/.*\Z/
  validates_attachment_content_type :list2, :content_type => /\Aimage\/.*\Z/

  def resume_url
    resume.url
  end

  def profile_url_actual
    profile.url(:actual)
  end

  def list1_url_thumb
    list1.url(:thumb)
  end

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
      prev_projects.delete_all
      selected_prev_projects = (prev_project_ids||[]).collect{|id| Project.find id}
      selected_prev_projects.each{|project| self.prev_projects << project }
    end
  end

  def self.available_grades
    ['cream', 'choco', 'jam', 'previous']
  end

  def self.available_tags
    ['Web Development', 'Visual Design', 'Strategy', 'User Experience', 'iOS Development', 'Android Development', 'Head']
  end

  def self.tag_color
    colors = ['#DE2F12', '#D01351', '#D4790D', '#0A86CD', '#000000', '#62C00E', 'violet']
    Hash[*(self.available_tags).zip(colors).flatten]
  end

end
