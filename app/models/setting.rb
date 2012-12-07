class Setting < ActiveRecord::Base
   attr_accessible :jobs_per_cat , :site_title , :job_expr_date_days,
                   :timezone ,:rss_in_gen , :rss_per_cat

  



  def self.time_zones
    timezones = YAML.load_file("#{Rails.root}/config/timezone.yml")
    timezones["timezones"]["times"]
  end
end
