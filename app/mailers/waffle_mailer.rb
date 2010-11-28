class WaffleMailer < ActionMailer::Base
  default :to => "hi@fronia.net"

  def contact_to_waffle(contact)
    @contact = contact
    mail(:from => contact.email, :subject => contact.message.mb_chars[0..20].to_s)
  end
end
