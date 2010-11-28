class ContactsController < ApplicationController
  def create
    @contact = Contact.new(params[:contact])
    if @contact.save
      WaffleMailer.contact_to_waffle(@contact).deliver
      render :json => @contact, :status => :created
    else
      render :json => @contact.errors, :status => :unprocessable_entity 
    end
  end
end
