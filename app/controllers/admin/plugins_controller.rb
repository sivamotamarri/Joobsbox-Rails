class Admin::PluginsController < ApplicationController
  before_filter :authenticate_user!
  layout 'admin'
end
