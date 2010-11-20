class Screenshot < ActiveRecord::Base
  belongs_to :project
  has_attached_file :image, :styles => { :big => "400x400>", :thumb => "100x100>" }
end
