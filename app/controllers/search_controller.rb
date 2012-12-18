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
end
