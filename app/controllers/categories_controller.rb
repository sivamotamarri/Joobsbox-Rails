class CategoriesController < ApplicationController
  def index
    @categories = Category.all
    respond_to do |format|
      format.rss { render :layout => false }
    end
  end

  def show
    @category = Category.find(params[:id])
    @jobs = @category.approved_jobs.limit(Setting.first.rss_per_cat || 10)
    respond_to do |format|
      format.html{}
      format.rss { render :layout => false }
    end
  end
end
