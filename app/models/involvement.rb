class Involvement < ActiveRecord::Base
	belongs_to :member
	belongs_to :project
end
