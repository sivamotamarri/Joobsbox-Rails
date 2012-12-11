class Theme < ActiveRecord::Base
   attr_accessible :name, :template_screen_shot , :is_active

  extend FriendlyId
  friendly_id :name, :use => :slugged

  scope :current_theme , where(:is_active => true).limit(1)
  scope :available_themes , where(:is_active => false)
end
