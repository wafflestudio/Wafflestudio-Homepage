class MembersController < ApplicationController
  def show
    @member = Member.find(params[:id])
    @member[:profile_url] = @member.profile.url(:actual)
    render :json => @member
  end
end
