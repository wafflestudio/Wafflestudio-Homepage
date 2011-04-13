class Admin::MembersController < AdminController
  def index
    @members = Member.all
  end

  def new
    @member = Member.new
  end

  def create
    @member = Member.new(params[:member]) 
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
    if @member.update_attributes(params[:member])
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

end
