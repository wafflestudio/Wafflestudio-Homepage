# encoding: utf-8

class Admin::TimelinesController < AdminController
  def index
    @timelines = Timeline.order('took_place_at')
    @timeline = Timeline.new
  end

  def create
    @timeline = Timeline.new(timeline_params) 
    if @timeline.save
      flash[:notice] = '생성 완료'
    else
      flash[:notice] = '생성 실패'
    end
    redirect_to admin_timelines_path
  end

  def update
    @timeline = Timeline.find(params[:id])
    if @timeline.update_attributes(timeline_params)
      render :text => 'success'
    else
      render :text => 'fail', :status => 403
    end
  end

  def destroy
    Timeline.destroy(params[:id])
    redirect_to admin_timelines_path
  end

  private
  def timeline_params
    params.require(:timeline).permit(:from_form, :name, :took_place_at)
  end
end
