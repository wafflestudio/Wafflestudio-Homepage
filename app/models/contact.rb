class Contact < ActiveRecord::Base

  validates :email, :presence => {:message => '이메일 주소를 입력해 주세요.'}, :format => {:with => /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i, :message => '이메일 주소가 잘못된 형식이에요.'}
  validates :phone, :format => {:with => /(\d{3}).*(\d{3}).*(\d{4})/}, :allow_blank => true
  validates :message, :length => {:minimum => 20, :message => '최소 20자 이상을 입력해 주세요.(스팸 방지를 위한 조치이니 양해해 주세요 ^^)'}

  def self.available_statuses
    ['unread', 'read', 'done']
  end
end
