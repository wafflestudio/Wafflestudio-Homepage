class ProjectsController < ApplicationController
  def show
    @project = Project.find params[:id]
    @project[:thumbnail_urls] = @project.screenshots.map{|s| s.image.url(:thumb)}[0..2]
    @project[:screenshot_urls] = @project.screenshots.map{|s| s.image.url(:big)}[0..2]
    @project[:logo_url] = @project.logo.nil? ? nil : @project.logo.image.url(:logo)
    @project[:since] = @project.start_date.strftime("%Y. %m") unless @project.start_date.nil?
    @project[:members] = @project.members.order('created_at').map do |m|
      m[:thumbnail_url] = m.list1.url(:thumb)
    end
    render :json => @project
  end
end
