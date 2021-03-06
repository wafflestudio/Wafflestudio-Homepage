class Screenshot < ApplicationRecord
  belongs_to :project
  has_attached_file :image, :styles => { :featured => "650x300#", :thumb => "120x90#", :big => "400x300#", :small => "85x65#", :logo => "200x35>"}
  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/

  def image_small
    image.url(:small)
  end

  def image_big
    image.url(:big)
  end

  def image_featured
    image.url(:featured)
  end

  def image_thumb
    image.url(:thumb)
  end

  def image_logo
    image.url(:logo)
  end
end
