class Home < ActiveRecord::Base
	attr_accessible :ideas, :user_id, :title, :description, :tags, :public, :uploaded_file


	#set up "uploaded_file" field as attached_file (using Paperclip) 
	has_attached_file :uploaded_file, 
	           :url => "/ideas/get/:id", 
	           :path => ":Rails.root/ideas/:id/:basename.:extension"

	validates_attachment_size :uploaded_file, :less_than => 10.megabytes   
	validates_attachment_presence :uploaded_file

  	def file_name 
    	uploaded_file_file_name 
	end
end
