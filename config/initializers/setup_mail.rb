#ActionMailer::Base.raise_delivery_errors = true
ActionMailer::Base.perform_deliveries = true
ActionMailer::Base.delivery_method = :smtp
ActionMailer::Base.smtp_settings = {
  :address => "smtp.gmail.com",
  :port => 587,
  :domain => "wafflestudio.com",
  :user_name => "hello@wafflestudio.com",
  :password => "gpffhdhkvmf",
  :authentication => "plain",
  :enable_starttls_auto => true
}
=begin
ActionMailer::Base.delivery_method = :sendmail
ActionMailer::Base.sendmail_settings = {
  :location       => '/usr/sbin/sendmail',
  :arguments      => '-i -t'
} 
=end
