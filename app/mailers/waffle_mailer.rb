# encoding: utf-8

class WaffleMailer < ActionMailer::Base

  def contact_to_waffle(contact)
    @contact = contact
    mail(:from => "와플문의메일 <hello@wafflestudio.com>", :to => "hello@wafflestudio.com", :subject => "[문의]#{contact.message.mb_chars[0..30].to_s}")
  end
end
