require 'yaml'
require 'sha1'

#system "touch #{RAILS_ROOT}/config/admin.yml"
#admin_credentials = YAML::load_file("#{RAILS_ROOT}/config/admin.yml")||[]
begin
  system "touch config/admin.yml"
  admin_credentials = YAML::load_file("config/admin.yml")||[]
  while true do
    print 'New ID: '
    new_id = gets
    if admin_credentials.find{|admin| admin[:id] == new_id.strip}
      puts "Already existing ID. Try another"
      next
    end
    system "stty -echo"
    print 'Password: '
    new_password = gets
    puts ' '
    print 'Password again: '
    confirm_password = gets
    puts ' '
    system "stty echo"
    if confirm_password == new_password
      admin_credentials.push({:id => new_id.strip, :password => SHA1::hexdigest(new_password.strip)})
#    yaml = File.open("#{RAILS_ROOT}/config/admin.yml", "w")
      yaml = File.open("config/admin.yml", "w")
      yaml.write(YAML::dump(admin_credentials))
      yaml.close
      puts "Successfully created admin!!"
      break
    end
  end
rescue NoMethodError, Interrupt
  puts "Interrupted~"
  system "stty echo"
end
