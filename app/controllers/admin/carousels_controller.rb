# encoding: utf-8

class Admin::CarouselsController < AdminController
  def index
    @carousels = Carousel.order('created_at desc')
  end
  
  def new
    @carousel = Carousel.new
  end

  def create
    @carousel = Carousel.new(carousel_params)
    if @carousel.save
      flash[:notice] = '생성완료'
      redirect_to admin_carousels_path
    else
      flash[:error] = '생성실패'
      render :action => :new
    end
  end

  def update
    @carousel = Carousel.find params[:id]
    if @carousel.update_attributes(carousel_params)
      render :text => 'success'
    else
      render :text => 'fail', :status => 403
    end
  end

  def destroy
    Carousel.destroy(params[:id])
    redirect_to admin_carousels_path
  end

  private
  def carousel_params
    params.require(:carousel).permit(:from_form, :c_image, :visibility, :action_type, :action_value)
  end
end
