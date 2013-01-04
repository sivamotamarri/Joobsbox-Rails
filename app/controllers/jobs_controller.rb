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
    authorize! :new, @user, :message => 'Not authorized as an employer.'
    @job = Job.new
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
    respond_to do |format|
      format.html {}
      format.rss { render :layout => false }
    end
  end
end
