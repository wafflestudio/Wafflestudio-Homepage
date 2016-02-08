class HomeController < ApplicationController
  def index
    @carousels = Carousel.where(:visibility => 'visible').reverse
    @timelines = Timeline.all
    @members = Member.all.where(is_visible: true).order(:group, :id)
    @projects = Project.all
    @contact = Contact.new
  end
end
