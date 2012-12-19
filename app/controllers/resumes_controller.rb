class ResumesController < ApplicationController
  layout 'jobseeker'

  def index
    
  end

  def new
    @resume = Resume.new
  end
end
