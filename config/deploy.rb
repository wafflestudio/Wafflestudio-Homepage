# config valid only for current version of Capistrano
lock '3.6.1'

set :application, 'wafflestudio_homepage'
set :repo_url, 'https://github.com/wafflestudio/Wafflestudio-Homepage.git'
server 'www.wafflestudio.com', :role => [:app, :web, :db], :primary => true
set :user, 'waffle-homepage'
set :use_sudo, true

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, '/var/www/homepage'

# Default value for :scm is :git
set :scm, :git
set :branch, 'deploy'

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
set :format_options, command_output: true, log_file: 'log/capistrano.log', color: :auto, truncate: :auto

# Default value for :pty is false
set :pty, true

# Default value for :linked_files is []
# append :linked_files, 'config/database.yml', 'config/secrets.yml'
append :linked_files, 'config/database.yml'
append :linked_files, 'config/admin.yml', 'config/mail_password.yml'
append :linked_files, 'config/thin.yml'

# Default value for linked_dirs is []
append :linked_dirs, 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'public/system'

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
set :keep_releases, 5

# rbenv setting
set :rbenv_type, :user
set :rbenv_ruby, '2.3.0'
set :rbenv_prefix, "RBENV_ROOT=#{fetch(:rbenv_path)} RBENV_VERSION=#{fetch(:rbenv_ruby)} #{fetch(:rbenv_path)}/bin/rbenv exec"
set :rbenv_map_bins, %w{rake gem bundle ruby rails}
set :rbenv_roles, :all # default values
set :rails_env, "production"

# thin setting
set :thin_config_path, -> { "#{shared_path}/config/thin.yml" }

after 'deploy:publishing', 'thin:restart'
