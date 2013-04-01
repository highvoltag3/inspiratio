class UserIdeaController < ApplicationController
  def index
  end

  def set_template_constants
    @main_container = 'loggedin'
    @user = true
  end
  
end
