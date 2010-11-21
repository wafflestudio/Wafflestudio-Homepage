require 'yaml'
require 'sha1'

class AdminController < ApplicationController
  before_filter :authorized?, :except => [:admin_index, :login]

  def admin_index
    unless session[:admin].nil?
      redirect_to admin_members_path
    end
  end

  def login
    if check_credential(params[:id], params[:password])
      session[:admin] = params[:id]
      redirect_to admin_members_path
    else
      flash[:error] = 'id or password is wrong'
      redirect_to admin_path
    end
  end

  def logout
    session[:admin] = nil
    redirect_to '/'
  end

  private

  def authorized?
    if !session[:admin]
      redirect_to admin_path
    end
  end

  def check_credential(id, password)
    credentials = YAML::load_file("#{RAILS_ROOT}/config/admin.yml")
    !credentials.find{|c| c[:id] == id and c[:password] == SHA1::hexdigest(password)}.nil?
  end
end
