class HomeController < ApplicationController
  def index
    if params[:f].blank?
      @ideas_list = Idea.order_by_recents
    else
      query = "order_by_#{params[:f]}"
      @ideas_list = Idea.send(query) if Idea.respond_to?(query)
    end

    # TODO: pagination (needs kaminari or will_paginate gems)
    # @ideas = (@ideas_list || Idea).page(params[:page])

    @ideas = (@ideas_list || Idea.all)
  end

end
