class Admin::ContactsController < AdminController
  def index
    @contacts = Contact.all
  end

  def update
    @contact = Contact.find params[:id]
    logger.info params[:contact].inspect
    if @contact.update_attributes(params[:contact])
      render :text => 'success'
    else
      render :text => 'fail', :status => 403
    end
  end

  def destroy
    Contact.destroy(params[:id])
    redirect_to admin_contacts_path
  end
end
