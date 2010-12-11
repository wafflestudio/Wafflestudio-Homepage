class MembersController < ApplicationController
  def show
    @member = Member.find params[:id], :include => [:projects]
    @member[:profile_url] = @member.profile.url(:actual)
    @member[:projects] = @member.projects.map do |p|
      p[:screenshot_urls] = p.screenshots.map{|s| s.image.url(:small)}
    end
    render :json => @member
  end
end
