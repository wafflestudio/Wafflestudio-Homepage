class WaffleMailer < ActionMailer::Base

  def contact_to_waffle(contact)
    @contact = contact
    mail(:from => "#{contact.name} <#{contact.email}>", :to => "hello@wafflestudio.com", :subject => "[문의]#{contact.message.mb_chars[0..30].to_s}")
  end
end
