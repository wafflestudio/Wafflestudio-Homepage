class ProjectsController < ApplicationController
  def show
    project = Project.find(params[:id]).as_json(:include => {:members => {:methods => :list1_url_thumb}, :screenshots => {:methods => [:image_big, :image_thumb]}, :logo => {:methods => :image_logo}})
    project["project"]["thumbnail_urls"] = project["project"]["screenshots"].map{|s| s["image_thumb"]}[0..2]
    project["project"]["screenshot_urls"] = project["project"]["screenshots"].map{|s| s["image_big"]}[0..2]
    project["project"]["logo_url"] = project["project"]["logo"].nil? ? nil : project["project"]["logo"]["image_logo"]
    project["project"]["since"] = project["project"]["start_date"].strftime("%Y. %m") unless project["project"]["start_date"].nil?
    project["project"]["members"] = project["project"]["members"].map do |m|
      m[:thumbnail_url] = m["list1_url_thumb"]
      { "member" => m }
    end
    render :json => project
  end
end
