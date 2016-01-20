# encoding: utf-8

class Admin::MembersController < AdminController
  def index
    @members = Member.all
  end

  def new
    @member = Member.new
  end

  def create
    @member = Member.new(member_params) 
    if @member.save
      flash[:notice] = '생성완료'
      redirect_to admin_members_path
    else
      flash[:error] = '생성실패'
      render :action => :new
    end
  end

  def edit
    @member = Member.find params[:id]
  end

  def update
    @member = Member.find params[:id]
    if @member.update_attributes(member_params)
      flash[:notice] = '수정완료'
      redirect_to admin_members_path
    else
      flash[:error] = '수정실패'
      render :action => :edit
    end
  end

  def destroy
    Member.destroy(params[:id])
    redirect_to admin_members_path
  end

  private
  def member_params
    params.require(:member).permit(:from_form, :name, :name_eng, :grade, :email, :twitter, :school, :website, :resume, :profile, :list1, :list2, :comment, :tag_names => [], :skill_inputs => [:name, :degree], :project_ids => [], :prev_project_ids => [])
  end

end
