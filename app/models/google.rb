class Google < ActiveRecord::Base
  # attr_accessible :title, :body
   attr_accessible :avatar
  has_attached_file :avatar


require "open-uri"

  def picture_from_url(url)
    self.avatar = URI.parse(url)
  end


end
