class Admin::RolesController < ApplicationController
  layout 'admin'


  before_filter :authenticate_user!
  def index    
    @role = Role.new
  end

  def new
    @role = Role.new
  end
  def create
    @role = Role.new(params[:role])

    respond_to do |format|
      if @role.save
        format.html { redirect_to(@role, :notice => 'Role was successfully created.') }
        format.json { respond_with_bip(@role) }
      else
        format.html { render :action => "new" }
        format.json  { respond_with_bip(@role) }
      end
    end
  end

  def edit
    @role = Role.find(params[:id])
  end

  def update
    if params[:id] == "new_role"
      @role = Role.new(params[:role])
      respond_to do |format|
        if @role.save
          format.html { redirect_to(@role, :notice => 'Role was successfully created.') }
          format.json { respond_with_bip(@role) }
        else
          format.html { render :action => "new" }
          format.json  { respond_with_bip(@role) }
        end
      end
    else
      @role = Role.find(params[:id])
      respond_to do |format|
        if @role.update_attributes(params[:role])
          format.html { redirect_to(@role, :notice => 'Role was successfully updated.') }
          format.json { respond_with_bip(@role) }
        else
          format.html { render :action => "edit" }
          format.json  { respond_with_bip(@role) }
        end
      end

    end    
  end
  
end
