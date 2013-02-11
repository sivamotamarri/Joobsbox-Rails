# To change this template, choose Tools | Templates
# and open the template in the editor.

class GoogleImage
 require 'open-uri'
  require 'json'

  attr_accessor :thumbnail, :original, :name, :position , :width , :height

  def initialize(params)
    super()
    self.name = params[:name]
    self.thumbnail = params[:thumbnail]
    self.original = params[:original]
    self.position = params[:position]
    self.width = params[:width]
    self.height = params[:height]
  end

  def self.find (keyword, position = 0)
    url = "http://ajax.googleapis.com/ajax/services/search/images?rsz=large&start=#{position}&v=1.0&q=#{CGI.escape(keyword)}"
    json_results = open(url) {|f| f.read };
    results = JSON.parse(json_results)
    puts results['responseData']['results']
    image_array = results['responseData']['results']
    image = image_array[0] if image_array
    google_image = self.new(:thumbnail => image['tbUrl'], :original => image['unescapedUrl'], :position => position, :name => keyword.titleize)
  end

  def self.all (keyword, position = 0)
    return [] if (keyword.nil? || keyword.strip.blank?)
    url = "http://ajax.googleapis.com/ajax/services/search/images?rsz=large&start=#{position}&v=1.0&q=#{CGI.escape(keyword)}"
    json_results = open(url) {|f| f.read };
    results = JSON.parse(json_results)
    begin
       puts results['responseData']['results']
      image_array = results['responseData']['results']
#      g = Google.new
#      g.picture_from_url( image_array[0]['unescapedUrl'])
#      g.save
      google_images = image_array.map{|image| self.new(:thumbnail => image['tbUrl'], :original => image['unescapedUrl'], :name => keyword.titleize , :width => image['width'] ,:height => image['height'] ) }
      google_images.each_index{|i| google_images[i].position = position + i }
    rescue
      []
    end
  end

end