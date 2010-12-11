class Screenshot < ActiveRecord::Base
  belongs_to :project
  has_attached_file :image, :styles => { :big => "400x300#", :thumb => "120x90#", :middle => "280x210#", :small => "85x65#"}
end
