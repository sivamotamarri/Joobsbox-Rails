class Resume < ActiveRecord::Base
   attr_accessible :nationality, :current_location,:mobile_number,:landline,:gender,:user_id,
                   :total_experience_yrs , :total_experience_mns , :current_industry ,:key_skills,
                   :resume_title , :attachment, :content_type , :filename

  belongs_to :user

  mount_uploader :attachment, AttachmentUploader

  validates :nationality, :current_location,:gender,:user_id,:resume_title , :attachment,
                   :total_experience_yrs , :total_experience_mns , :current_industry ,
                   :key_skills, :presence => true

  validates :mobile_number, :presence => {:message => "mobile or landline required" , :if => Proc.new {|resume| resume.landline.blank? }}
  validates :landline, :presence => {:message => "mobile or landline required", :if => Proc.new {|resume| resume.mobile_number.blank?}}
  
  validates :landline, :format => { :with => /^\d{10}$/, :allow_blank => true}
  validates :mobile_number, :format => { :with => /^[1-9]\d{9}$/, :allow_blank => true}



  INDUSTRIES = ["Automotive/ Ancillaries","Banking/ Financial Services","Bio Technology & Life Sciences",
 "Chemicals/ Plastic/ Rubber","Construction","Consumer Goods/ FMCG","Education",
 "Entertainment/ Media/ Publishing","Insurance","ITES/ BPO/ KPO","IT/ Computers - Hardware",
 "IT/ Computers - Software","Machinery/ Equipment Mfg","Oil/ Gas/ Petroleum","Pharmaceuticals",
 "Power","Real Estate","Retailing","Telecom","Advertising","Agriculture/ Dairy Based",
 "Airlines","Beauty/Fitness/PersonalCare/SPA","Beverages/ Liquor","Cement","Consultancy",
 "Courier/ Freight/ Transportation","Dotcom","E-Learning","Engineering, Procurement, Construction",
 "Facility management","Fertilizer/ Pesticides","Food & Packaged Food","Textiles / Yarn / Fabrics / Garments",
 "Gems & Jewellery","Government/ PSU/ Defence","Home Appliances (TV, Fridge, AC etc.)",
 "Hospitals/ Health Care","Hotels/ Restaurant","Import / Export","Iron/ Steel","ISP","Leather",
 "Market Research","Medical Transcription","Mining","NGO","Non-Ferrous Metals (Aluminium, Zinc etc.)",
 "Office Equipment","Paints","Paper","Printing/ Packaging","Public Relations (PR)","Semiconductor",
 "Shipping","Social Media","Sugar","Travel/ Tourism","Tyres","Wood","Other","Any"]

  def self.nationalities
    nationality = YAML.load_file("#{Rails.root}/config/nationality.yml")
    nationality["nationality"]["countries"]
  end

  def self.current_loactions
    locations = YAML.load_file("#{Rails.root}/config/currentlocation.yml")
    locations["locations"]
  end



  before_save :update_attachment_attributes

   searchable do
    text :resume_title , :key_skills    
    time    :created_at

    attachment :document_attachment
  end

  
  def document_attachment
	    "#{Rails.root}/public/#{attachment.url}"
  end
  private

  def update_attachment_attributes
    if attachment.present? && attachment_changed?
      self.content_type = attachment.file.content_type
      self.filename = attachment.file.original_filename
    end
  end

end

#
#+----------------------+--------------+------+-----+---------+----------------+
#| Field                | Type         | Null | Key | Default | Extra          |
#+----------------------+--------------+------+-----+---------+----------------+
#| id                   | int(11)      | NO   | PRI | NULL    | auto_increment |
#| nationality          | varchar(255) | YES  |     | NULL    |                |
#| current_location     | varchar(255) | YES  |     | NULL    |                |
#| mobile_number        | varchar(255) | YES  |     | NULL    |                |
#| landline             | varchar(255) | YES  |     | NULL    |                |
#| gender               | varchar(255) | YES  |     | NULL    |                |
#| user_id              | int(11)      | YES  |     | NULL    |                |
#| total_experience_yrs | int(11)      | YES  |     | NULL    |                |
#| total_experience_mns | int(11)      | YES  |     | NULL    |                |
#| current_industry     | varchar(255) | YES  |     | NULL    |                |
#| function             | varchar(255) | YES  |     | NULL    |                |
#| key_skills           | varchar(255) | YES  |     | NULL    |                |
#| resume_title         | varchar(255) | YES  |     | NULL    |                |
#| attachment           | varchar(255) | YES  |     | NULL    |                |
#| created_at           | datetime     | NO   |     | NULL    |                |
#| updated_at           | datetime     | NO   |     | NULL    |                |
#+----------------------+--------------+------+-----+---------+----------------+

