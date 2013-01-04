class Admin::GroupPermissionsController < ApplicationController
  layout 'admin'
  before_filter :authenticate_user!

  def index
    
  end

  def show
    @group = Group.find(params[:id])
    @persmissions = @group.permissions
    @permission = Permission.new
  end

  def new

  end
  
  def update
    @group = Group.find(params[:id])
    @permission = Permission.find_by_joobs_model_name_and_group_id(params[:permission][:joobs_model_name], @group.id)
    if !@permission.blank?
      respond_to do |format|
      if @permission.update_attributes(:r => params[:permission][:r][0] , :c => params[:permission][:c][0],
                :u => params[:permission][:u][0] , :d => params[:permission][:d][0] , :m => params[:permission][:m] , :limited => params[:permission][:limited] )
      format.html { redirect_to admin_group_permission_path(@group), notice: 'The Group Permission has been Submitted Successfully.' }
        format.json { render json: @permission, status: :created, location: @permission }
      else
        format.html { render action: "new" }
        format.json { render json: @permission.errors, status: :unprocessable_entity }
      end
      end
    else
    @permission = Permission.new(params[:permission])
    @permission.r = params[:permission][:r][0]
    @permission.c = params[:permission][:c][0]
    @permission.u = params[:permission][:u][0]
    @permission.d = params[:permission][:d][0]
    @permission.m = params[:permission][:m]
    
   respond_to do |format|
      if @permission.save
        format.html { redirect_to admin_group_permission_path(@group), notice: 'The Group Permission has been Submitted Successfully.' }
        format.json { render json: @permission, status: :created, location: @permission }
      else
        format.html { render action: "new" }
        format.json { render json: @permission.errors, status: :unprocessable_entity }
      end
    end
    end
  end
end
