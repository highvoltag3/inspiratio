class HomeController < ApplicationController 

  def index 
     @ideas = Idea.all
  end

  def show
    @idea = Idea.find(params[:id])
  end

  #this action will let the users download the files (after a simple authorization check) 
  def get 
    idea = Idea.find_by_id(params[:id]) 
    if idea 
      send_file idea.uploaded_file.path, :type => idea.uploaded_file_content_type 
    end
  end

end