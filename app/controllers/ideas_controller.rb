class IdeasController < ApplicationController
  before_filter :authenticate_user!, except: [:show]
  before_filter :find_idea, only: [:edit, :update, :destroy]

  def index
    @ideas = current_user.ideas
  end

  def show
    unless @idea = Idea.where(id: params[:id]).first
      redirect_to :back, :notice  => "Idea not found."
    end
  end

  def new
    @idea = Idea.new
  end

  def create
    @idea = current_user.ideas.build(params[:idea])

    if @idea.save
      redirect_to @idea, :notice => "Successfully created idea."
    else
      render :action => 'new'
    end
  end

  def edit
  end

  def update
    if @idea.update_attributes(params[:idea])
      redirect_to @idea, :notice  => "Successfully updated idea."
    else
      render :action => 'edit'
    end
  end

  def destroy
    @idea.destroy
    redirect_to ideas_url, :notice => "Successfully destroyed idea."
  end

  private
  def find_idea
    unless @idea = current_user.ideas.where(id: params[:id]).first
      redirect_to :back, :notice  => "Sorry you can't modify an idea that's not yours."
    end
  end

end
