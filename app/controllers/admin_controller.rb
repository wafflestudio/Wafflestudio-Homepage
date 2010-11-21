require 'yaml'
require 'sha1'

class AdminController < ApplicationController
  before_filter :authorized?, :except => [:authorize, :login]

  def login
    if session[:admin]
      render :action => :index
    end
  end

  def index

  end

  def authorize
    if check_credential(params[:id], params[:password])
      session[:admin] = params[:id]
      redirect_to admin_members_path
    else
      flash[:error] = 'Wrong id or password!'
      redirect_to admin_path
    end
  end

  def logout
    session[:admin] = nil
    flash[:notice] = '로그아웃!'
    render :action => :login
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
