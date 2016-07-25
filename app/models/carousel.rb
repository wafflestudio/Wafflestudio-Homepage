class Carousel < ApplicationRecord
  has_attached_file :c_image, :styles => {:middle => '340x260#', :thumb => '150x150>'}
  validates_attachment_content_type :c_image, :content_type => /\Aimage\/.*\Z/
  serialize :action, Hash
  attr_accessor :action_type, :action_value, :from_form

  before_save :set_action

  def set_action
    unless from_form.nil?
      self.action = {:type => action_type, :value => action_value}
    end
  end

  def self.available_visibility_options
    ['visible', 'invisible']
  end

  def self.available_action_types
    ['project', 'member', 'url']
  end
end
