class HomeController < ApplicationController
  def index
     @ideas = Idea.all
  end

  def show
    unless @idea = Idea.where(id: params[:id]).first
      redirect_to root_path
    end
  end

end
