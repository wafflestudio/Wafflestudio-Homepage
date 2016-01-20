class MembersController < ApplicationController
  def show
    member = Member.find(params[:id]).as_json(:include => {:projects => {:include => {:screenshots => {:methods => [:image_small]}}}}, :methods => [:resume_url, :profile_url_actual])
    member["member"]["profile_url"] = member["member"]["profile_url_actual"]
    member["member"]["resume_url"] = member["resume"]
    member["member"]["projects"] = member["member"]["projects"].map do |p|
      p["screenshot_urls"] = p["screenshots"].map{|s| s["image_small"]}
      { "project" => p }
    end
=begin
    @member[:profile_url] = @member.profile.url(:actual)
    @member[:resume_url] = @member.resume.url
    @member[:projects] = @member.projects.map do |p|
      p[:screenshot_urls] = p.screenshots.map{|s| s.image.url(:small)}
    end
    render :json => @member
=end
    render :json => member
  end
end
