# encoding: utf-8

require 'yaml'
require 'sha1'

class AdminController < ApplicationController
  before_filter :authorized?, :except => [:authorize, :login]

  def login
    if session[:admin]
      redirect_to admin_index_path
    end
  end

  def index
    @unread_contacts_cnt = Contact.count :all, :conditions => {:status => 'unread'}
  end

  def authorize
    if check_credential(params[:id], params[:password])
      session[:admin] = params[:id]
    else
      flash[:error] = 'Wrong id or password!'
    end
    redirect_to admin_path
  end

  def logout
    session[:admin] = nil
    flash[:notice] = '로그아웃!'
    redirect_to admin_path
  end

  private

  def authorized?
    if !session[:admin]
      redirect_to admin_path
    end
  end

  def check_credential(id, password)
    credentials = YAML::load_file("#{Rails.root.to_s}/config/admin.yml")
    !credentials.find{|c| c[:id] == id and c[:password] == SHA1::hexdigest(password)}.nil?
  end
end
