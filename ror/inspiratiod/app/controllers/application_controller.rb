class ApplicationController < ActionController::Base
  protect_from_forgery

  before_filter :set_template_constants
  def set_template_constants
  end

  layout 'application'
end
