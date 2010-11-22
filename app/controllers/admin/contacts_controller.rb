class Admin::ContactsController < AdminController
  def index
    @contacts = Contact.order('created_at desc')
  end

  def update
    @contact = Contact.find params[:id]
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
