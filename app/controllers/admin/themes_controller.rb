class Admin::ThemesController < ApplicationController
  layout 'admin'
  before_filter :authenticate_user!


  def update
    Theme.update_all(:is_active => false)
    theme = Theme.find(params[:id])
    respond_to do |format|
      if theme.update_attributes(:is_active => true)    
        format.html { redirect_to admin_themes_path, notice: 'The Theme has been Updated Successfully.' }
        format.json { }
      else
        format.html { render action: "index" }
        format.json {}
      end
    end  
  end
end
