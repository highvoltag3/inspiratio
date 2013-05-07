class IdeasController < ApplicationController
  before_filter :authenticate_user!, except: [:show]
  before_filter :find_user_idea, only: [:edit, :update, :destroy]
  before_filter :find_idea, only: [:show, :like, :comment]

  def index
    @idea = Idea.new
    @ideas = current_user.ideas
  end

  def show
    # track page views from logged in users
    # unless the user is the author ;-)
    if current_user && @idea.user_id != current_user.id
      @idea.viewed!
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

  def like
    action, verb = current_user.likes_idea?(@idea) ? [:unlike_idea!, 'unliked'] : [:like_idea!, 'liked']
    current_user.send(action, @idea)

    if request.xhr?
      render json: { idea: { id: @idea.id, likes: @idea.likes_users_count } }
    else
      redirect_to @idea, notice: "Cool you just #{verb} this idea."
    end

  end

  def comment
    comment = current_user.comments.build(params[:comment])
    comment.idea_id = @idea.id

    if comment.save
      flash[:notice] = "Comment added, thank you!."
    end
    redirect_to @idea
  end

  def user_idea
    @ideas = Idea.find_all_by_user_id(params[:id])
  end

  def save_bubble_list
    @idea = Idea.find(params[:id])
    if request.format.json?
        @idea.tag_list.add(params[:bubblelist][:tag_list])
        @idea.save
        render json: { idea: { id: @idea.id, idea: @idea.tags } }
    end
  end

  def get_bubble_list
    @idea = Idea.find(params[:id])
    if request.format.json?
        render json: { idea: { id: @idea.id, tags: @idea.tag_list } }
    end
  end

  def del_from_bubble_list
    @idea = Idea.find(params[:id])
    if request.format.json?
        @idea.tag_list.remove(params[:bubblelist][:tag])
        @idea.save
        render json: { idea: { id: @idea.id, tags: @idea.tag_list } }
    end
  end

  private
  def find_user_idea
    unless @idea = current_user.ideas.where(id: params[:id]).first
      redirect_to :back, :notice  => "Sorry you can't modify an idea that's not yours."
    end
  end

  def find_idea
    unless @idea = Idea.where(id: params[:id]).first
      redirect_to :back, :notice  => "Idea not found."
    end
  end

end
