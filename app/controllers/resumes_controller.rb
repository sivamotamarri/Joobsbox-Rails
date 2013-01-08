class ResumesController < ApplicationController
  layout 'jobseeker'

  def index
    @resumes = current_user.resumes
  end

  def new
    @resume = Resume.new
    authorize! :create, @resume, :message => 'Not authorized as an jobseeker.'
  end

  def create
    @resume = Resume.new(params[:resume])
    respond_to do |format|
      if @resume.save
        format.html { redirect_to resumes_path, notice: 'The Resume has been Submitted.Thank you for submitting .' }
        format.json { render json: @resume, status: :created, location: @resume }
      else
        format.html { render action: "new" }
        format.json { render json: @resume.errors, status: :unprocessable_entity }
      end
    end
  end

  def show
    @resume = Resume.find(params[:id])
    send_file "#{Rails.root}/public#{@resume.attachment.url}",
            :filename => @resume.filename ,
            :type => @resume.content_type,
            :disposition => 'attachment'
  end


  def destroy
    @resume = current_user.resumes.find(params[:id])
    if @resume.destroy
      flash[:notice] = "Resume was deleted."
      redirect_to resumes_url
    end
  end

  def apply
    @job = Job.find(params[:id])
    @applied_resume = AppliedResume.new
  end

  def submit_profile
    @job = Job.find(params[:applied_resume][:job_id])
    @applied_resume = AppliedResume.new(params[:applied_resume])
    @applied_resume.applied_date = Date.today
    respond_to do |format|
      if @applied_resume.save
        format.html { redirect_to jobs_path, notice: 'The Resume has been Submitted.Thank you for submitting .' }
        format.json { render json: @applied_resume, status: :created, location: @applied_resume }
      else
        format.html { render action: "apply" }
        format.json { render json: @applied_resume.errors, status: :unprocessable_entity }
      end
    end
  end
end
