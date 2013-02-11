class JobsController < ApplicationController
  
  before_filter :authenticate_user! , :except => [:show, :index]
  
  def index
    @jobs = Job.all(:limit => Setting.first.rss_in_gen || 10)
    respond_to do |format|
      format.html {}
      format.rss { render :layout => false }
    end
  end

  def new
    @job = Job.new
    groups = current_user.groups
    if !groups.blank?
      current_user.can_create?(groups,"Job")
    else
     authorize! :create, @job, :message => 'Not authorized as an employer.'
    end
  end

  def create
    @job = Job.new params[:job]
    respond_to do |format|
      if @job.save
        format.html { redirect_to @job, notice: 'The job has been saved. It now has to be accepted by a moderator in order to appear publicly on the site.' }
        format.json { render json: @job, status: :created, location: @job }
      else
        format.html { render action: "new" }
        format.json { render json: @job.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit
    @job = Job.find(params[:id])
    groups = current_user.groups
    if !groups.blank?
      current_user.can_update?(groups,"Job")
    else
       authorize! :update, @job, :message => 'Not authorized as an employer.'
    end
  end

  def update
    @job = Job.find(params[:id])    
    respond_to do |format|
      if @job.update_attributes(params[:job])        
        format.html { redirect_to @job, notice: 'The job has been Updated.' }
        format.json { render json: @job, status: :created, location: @job }
      else
        format.html { render action: "new" }
        format.json { render json: @job.errors, status: :unprocessable_entity }
      end
    end
  end


  def show
    @job = Job.find(params[:id])
    if user_signed_in?
    groups = current_user.groups
    if !groups.blank?
      current_user.can_read?(groups,"Job")
    else
       authorize! :read, @job, :message => 'Not authorized as an employer.'
    end
    end
    respond_to do |format|
      format.html {}
      format.rss { render :layout => false }
    end
  end

  def applied_resumes
    @job = Job.find(params[:id])
    @profiles = @job.applied_users
  end

  def my_postings
     @jobs = current_user.jobs
    respond_to do |format|
      format.html {}
    end
  end

  
end
