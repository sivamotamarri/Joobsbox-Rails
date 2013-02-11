class SearchController < ApplicationController

  def index
    @jobs = Job.search do
      keywords params[:jobq]

      with(:is_approved , true)
      with(:expiration_date).greater_than Time.now
      order_by :created_at, :desc
      paginate :page => params[:page] || 1, :per_page => 15
     
    end  
    @jobs = @jobs.results
  end



  def search
      @resumes = Resume.search do
      keywords params[:resumeq]
      without(:user_id, current_user.id)
      order_by :created_at, :desc
      paginate :page => params[:page] || 1, :per_page => 15

    end
    @resumes = @resumes.results
  end


  def google_images
    params[:start] = params[:start].to_i
    @page_title = "Import image from Google"
    @google_images = GoogleImage.all(params[:keywords], params[:start])
  end
  
end
