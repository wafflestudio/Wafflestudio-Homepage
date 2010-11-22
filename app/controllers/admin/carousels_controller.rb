class Admin::CarouselsController < AdminController
  def index
    @carousels = Carousel.order('created_at desc')
  end
  
  def new
    @carousel = Carousel.new
  end

  def create
    @carousel = Carousel.new(params[:carousel])
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
    if @carousel.update_attributes(params[:carousel])
      render :text => 'success'
    else
      render :text => 'fail', :status => 403
    end
  end

  def destroy
    Carousel.destroy(params[:id])
    redirect_to admin_carousels_path
  end
end
