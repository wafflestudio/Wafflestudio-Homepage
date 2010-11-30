puts 'mail sender loaded'
unsent_contact = Contact.where(:mail_status => 'unsent')
puts 'no contacts to send' if unsent_contact.length < 1
unsent_contact.each do |contact|
  WaffleMailer.contact_to_waffle(contact).deliver
  contact.update_attributes({:mail_status => 'sent'})
  puts "Contact(#{contact.id}) sent!"
end
