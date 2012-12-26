class Admin::GroupsController < ApplicationController

  layout 'admin'
  before_filter :authenticate_user!

  def index
    @groups = Group.all
    @group = Group.new
    respond_to do |format|
        format.html {}
        format.js {}
    end
  end

  def new
    @group = Group.new
  end

  def show
    @group = Group.find(params[:id])
  end

  def edit
    @group = Group.find(params[:id])
  end

  def create
    @group = Group.new(params[:group])

    respond_to do |format|
       if @group.save
        format.html { redirect_to(@group, :notice => 'Group was successfully created.') }
        format.json { render json: @group, status: :created, location: @group }
      else
        format.html { render :action => "new" }
        format.json { render json: @groups.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def update
    if params[:id] == "new_group"
      @group = Group.new(params[:group])
      respond_to do |format|
        if @group.save          
          format.html { redirect_to(@group, :notice => 'Group was successfully created.') }
          format.json { respond_with_bip(@group) }
        else
          format.html { render :action => "new" }
          format.json  { respond_with_bip(@group) }
        end
      end
    else
      @group = Group.find(params[:id])
      respond_to do |format|
        if @group.update_attributes(params[:group])         
          format.html { redirect_to(@group, :notice => 'Group was successfully updated.') }
          format.json { respond_with_bip(@group) }
        else
          format.html { render :action => "edit" }
          format.json  { respond_with_bip(@group) }
        end
      end
    end    
  end


  def users
    @group = Group.find(params[:id])
    @users = User.all
    @users = @users  - @group.users
  end

  def add_users 
    @group = Group.find(params[:id])
    params[:user].each do |u|
     @group.add_user User.find(u)
   end
     render :text => "The operation has finished successfully."
  end

  def remove_users
    @group = Group.find(params[:id])
  params[:user].each do |u|
     @group.remove_user User.find(u)
   end
     render :text => "The operation has finished successfully."
  end

end
