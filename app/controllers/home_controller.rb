class HomeController < ApplicationController
  def index
    @carousels = Carousel.all
    @timelines = Timeline.all
    @members = Member.all
    @projects = Project.all
    @contact = Contact.new
  end
end
