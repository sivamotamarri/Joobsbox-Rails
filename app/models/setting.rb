class Setting < ActiveRecord::Base
   attr_accessible :jobs_per_cat , :site_title , :job_expr_date_days,
                   :timezone ,:rss_in_gen , :rss_per_cat

  
   validates :job_expr_date_days , :jobs_per_cat ,:rss_in_gen , :rss_per_cat , :numericality => { :only_integer => true }


  def self.time_zones
    timezones = YAML.load_file("#{Rails.root}/config/timezone.yml")
    timezones["timezones"]["times"]
  end
end
