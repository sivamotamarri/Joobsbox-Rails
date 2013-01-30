class ApplicationController < ActionController::Base
  protect_from_forgery

  layout :layout_by_resource

  before_filter :load_theme

  rescue_from CanCan::AccessDenied do |exception|
    redirect_to root_path, :alert => exception.message
  end

  protected

  def load_theme
    session[:theme] = Theme.current_theme.first.name
  end
  
  def layout_by_resource
    if devise_controller?
      "devise_layout"
    else
      "application"
    end
  end
  
end
