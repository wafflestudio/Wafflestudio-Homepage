class WaffleMailer < ActionMailer::Base
  default :from => "hello@wafflestudio.com", :to => "hello@wafflestudio.com"

  def contact_to_waffle(contact)
    @contact = contact
    mail(:subject => "[문의]#{contact.message.mb_chars[0..30].to_s}")
  end
end
