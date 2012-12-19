# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Role.delete_all
User.delete_all
Setting.delete_all
Theme.delete_all

puts 'CREATING ROLES'
Role.create([
  { :name => 'admin' },
  { :name => 'jobseeker' },
  { :name => 'employer' },
  { :name => 'recruiter'},
  { :name => 'agent'}
], :without_protection => true)
puts 'SETTING UP DEFAULT USER LOGIN'
user = User.create! :name => 'Admin', :email => 'admin@joobsbox.com', :password => 'pramati123', :password_confirmation => 'pramati123'
puts 'New user created: ' << user.name
user2 = User.create! :name => 'Secondary Admin', :email => 'secondry_admin@joobsbox.com', :password => 'pramati123', :password_confirmation => 'pramati123'
puts 'New user created: ' << user2.name
user.add_role :admin
user2.add_role :employer

Setting.create(:jobs_per_cat =>10, :site_title => "Joobsbox" ,
            :job_expr_date_days =>  30 , :timezone  => 'Central Time (US & Canada)' ,
            :rss_in_gen => 15 , :rss_per_cat =>  15)
          
puts 'creating default themes'

Theme.create(:name => "joobsbox" , :template_screen_shot => "/assets/admin/themes/joobsbox/screenshot.png" , :is_active => true)
Theme.create(:name => "default" , :template_screen_shot => "/assets/admin/themes/default/screenshot.png")