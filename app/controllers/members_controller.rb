class MembersController < ApplicationController
  def show
    @member = Member.find params[:id]
    @member[:profile_url] = @member.profile.url(:actual)
    @member[:resume_url] = @member.resume.url
    @member[:projects] = @member.projects.map do |p|
      p[:screenshot_urls] = p.screenshots.map{|s| s.image.url(:small)}
    end
    render :json => @member
  end
end
