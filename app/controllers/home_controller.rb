class HomeController < ApplicationController
  def index
     @ideas = Idea.all
  end

  def show
    @idea = Idea.where(id: params[:id]).first
  end

end
