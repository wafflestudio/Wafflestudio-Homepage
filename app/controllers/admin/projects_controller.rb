# encoding: utf-8

class Admin::ProjectsController < AdminController
  def index
    @projects = Project.all
  end

  def new
    @project = Project.new
  end

  def create
    @project = Project.new(params[:project])
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
    if @project.update_attributes(params[:project])
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
end
