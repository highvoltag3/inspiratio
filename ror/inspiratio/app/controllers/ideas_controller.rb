class IdeasController < ApplicationController
  #before_filter :authenticate_user!  #authenticate for users before any methods is called



  def index
    @ideas = Idea.find(:all, :conditions => ["user_id = ?", current_user.id])
  end

  def show
    @idea = Idea.find(params[:id])
  end

  def new
    @idea = Idea.new
  end

  def create
    @idea = Idea.new(params[:idea].merge(:user_id => current_user.id))
    if @idea.save
      redirect_to @idea, :notice => "Successfully created idea."
    else
      render :action => 'new'
    end
  end

  def edit
    if( current_user )
      @idea = Idea.find(params[:id])
    else 
      redirect_to :back, :notice  => "Sorry you can't edit an idea that's not yours."
    end
  end

  def update
    @idea = Idea.find(params[:id])
    if @idea.update_attributes(params[:idea])
      redirect_to @idea, :notice  => "Successfully updated idea."
    else
      render :action => 'edit'
    end
  end

  def destroy
    @idea = Idea.find(params[:id])
    @idea.destroy
    redirect_to ideas_url, :notice => "Successfully destroyed idea."
  end

  #this action will let the users download the files (after a simple authorization check) 
  def get 
    idea = Idea.find_by_id(params[:id]) 
    if idea 
      send_file idea.uploaded_file.path, :type => idea.uploaded_file_content_type 
    end
  end


end
