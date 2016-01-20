class ProjectsController < ApplicationController
  def show
    @project = Project.find params[:id]
    project = @project.as_json(:include => {:members => {:methods => :list1_url_thumb}})
    project["project"]["thumbnail_urls"] = @project.screenshots.map{|s| s.image.url(:thumb)}[0..2]
    project["project"]["screenshot_urls"] = @project.screenshots.map{|s| s.image.url(:big)}[0..2]
    project["project"]["logo_url"] = @project.logo.nil? ? nil : @project.logo.image.url(:logo)
    project["project"]["since"] = @project.start_date.strftime("%Y. %m") unless @project.start_date.nil?
    puts project
    project["project"]["members"] = project["project"]["members"].map do |m|
      m[:thumbnail_url] = m["list1_url_thumb"]
      { "member" => m }
    end
    render :json => project
  end
end
