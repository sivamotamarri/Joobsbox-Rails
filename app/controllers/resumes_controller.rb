class ResumesController < ApplicationController
  layout 'jobseeker'

  def index
    @resumes = current_user.resumes
  end

  def new
    @resume = Resume.new
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

end
