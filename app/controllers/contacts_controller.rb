class ContactsController < ApplicationController
  def create
    @contact = Contact.new(contact_params)
    sleep 0.5 
    if @contact.save
      #WaffleMailer.contact_to_waffle(@contact).deliver
      render :json => @contact, :status => :created
    else
      render :json => @contact.errors, :status => 444 
    end
  end

  private
  def contact_params
    params.require(:contact).permit(:commit, :name, :email, :phone, :message)
  end
end
