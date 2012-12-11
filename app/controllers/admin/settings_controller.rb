class Admin::SettingsController < ApplicationController
  layout 'admin'

  before_filter :authenticate_user!
  
  def index
    @setting = Setting.first
  end


  def update
    

    @setting = Setting.find(params[:id])
    
    respond_to do |format|
      if @setting.update_attributes(params[:setting])
        format.html { redirect_to(admin_settings_url(), :notice => 'Yay! Your settings was updated successfully.') }
      else
        if !@setting.errors[:base].empty?
          flash.now[:error] = @setting.errors[:base].first
          format.html { render :action => "index" }
        else
          format.html { render :action => "index"}
        end
      end
    end
  end


end
