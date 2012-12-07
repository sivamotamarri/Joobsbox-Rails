class JobsController < ApplicationController

  before_filter :authenticate_user!
  
  def index
  end

  def new
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


  def show
    @job = Job.find(params[:id]) 
  end
end
