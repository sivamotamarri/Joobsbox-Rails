class Admin::ThemesController < ApplicationController
  layout 'admin'
  before_filter :authenticate_user!
end
