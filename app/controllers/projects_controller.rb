class ProjectsController < ApplicationController
  def show
    @project = Project.find params[:id], :include => [:members]
    @project[:thumbnail_urls] = @project.screenshots.map{|s| s.image.url(:thumb)}
    @project[:screenshot_urls] = @project.screenshots.map{|s| s.image.url(:big)}
    @project[:since] = @project.start_date.strftime("%Y. %m") unless @project.start_date.nil?
    @project[:members] = @project.members.map do |m|
      m[:thumbnail_url] = m.list1.url(:thumb)
    end
    render :json => @project
  end
end
