class HomeController < ApplicationController
  def index
     @ideas = Idea.all
  end

  def show
    @idea = Idea.where(id: params[:id]).first
  end

  #this action will let the users download the files (after a simple authorization check)
  # TODO: this is wrong, check a better way to do this
  #
  def get
    if idea = Idea.where(id: params[:id]).first
      send_file idea.current_image.path, type: idea.current_image_content_type
    end
  end

end
