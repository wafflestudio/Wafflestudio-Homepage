# encoding: utf-8

class Admin::ProjectsController < AdminController
  def index
    @projects = Project.all
  end

  def new
    @project = Project.new
  end

  def create
    @project = Project.new(project_params)
    if @project.save
      flash[:notice] = '생성완료'
      redirect_to admin_projects_path
    else
      flash[:notice] = '생성실패'
      render :action => :new
    end
  end

  def edit
    @project = Project.find params[:id]
  end

  def update
    @project = Project.find params[:id]
    if @project.update_attributes(project_params)
      puts @project.from_form
      puts '수정'
      flash[:notice] = '수정완료'
      redirect_to admin_projects_path
    else
      flash[:error] = '수정실패'
      render :action => :edit
    end
  end

  def destroy
    Project.destroy(params[:id])
    redirect_to admin_projects_path
  end

  def destroy_screenshot
    Screenshot.destroy(params[:id])
    redirect_to :back
  end

  private
  def project_params
    params.require(:project).permit(:from_form, :name, :subtitle, :description, :start_date, :is_visible, :status, :link, :logo_img, :featured_img, :member_ids => [], :prev_member_ids => [], :screenshot_files => [])
  end

end
