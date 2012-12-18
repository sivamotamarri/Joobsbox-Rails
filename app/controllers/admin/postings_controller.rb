class Admin::PostingsController < ApplicationController
  layout 'admin'
  before_filter :authenticate_user!

  def create
    if params[:job]
       if params[:actionPending] == "accept"
          Job.update_all("is_approved = 1", "id in (#{params[:job].join(',')})" )
          Job.solr_reindex
          Sunspot.commit
       else
          Job.delete_all("id in (#{params[:job].join(',')})")
       end
      render :text => "The operation has finished successfully."
    else
      render :text => "Please select the postings to accept or delete."
    end  
  end
end
