class Idea < ActiveRecord::Base
	belongs_to :user
	attr_accessible :user_id, :title, :description, :tags, :public

end
