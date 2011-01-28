class ContactsController < ApplicationController
  def create
    @contact = Contact.new(params[:contact])
    sleep 0.5 
    if @contact.save
      #WaffleMailer.contact_to_waffle(@contact).deliver
      render :json => @contact, :status => :created
    else
      render :json => @contact.errors, :status => 444 
    end
  end
end
