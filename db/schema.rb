# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130211091135) do

  create_table "applied_resumes", :force => true do |t|
    t.integer  "resume_id"
    t.integer  "job_id"
    t.text     "covering_letter"
    t.date     "applied_date"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

  create_table "categories", :force => true do |t|
    t.string   "name"
    t.string   "link"
    t.integer  "order_index"
    t.integer  "parent_id"
    t.integer  "lft"
    t.integer  "rgt"
    t.integer  "depth"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
    t.string   "slug"
  end

  create_table "googles", :force => true do |t|
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
  end

  create_table "groups", :force => true do |t|
    t.string   "name"
    t.boolean  "status",     :default => true
    t.datetime "created_at",                   :null => false
    t.datetime "updated_at",                   :null => false
  end

  create_table "jobs", :force => true do |t|
    t.string   "title"
    t.text     "description"
    t.string   "company"
    t.integer  "category_id"
    t.integer  "user_id"
    t.string   "to_apply"
    t.string   "location"
    t.integer  "updated_by"
    t.datetime "code_stamp"
    t.datetime "created_at",                         :null => false
    t.datetime "updated_at",                         :null => false
    t.string   "slug"
    t.boolean  "is_approved",     :default => false
    t.boolean  "status",          :default => false
    t.date     "expiration_date"
  end

  create_table "permissions", :force => true do |t|
    t.integer  "group_id"
    t.string   "joobs_model_name"
    t.string   "r"
    t.string   "c"
    t.string   "u"
    t.string   "d"
    t.string   "m"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "resumes", :force => true do |t|
    t.string   "nationality"
    t.string   "current_location"
    t.string   "mobile_number"
    t.string   "landline"
    t.string   "gender"
    t.integer  "user_id"
    t.integer  "total_experience_yrs"
    t.integer  "total_experience_mns"
    t.string   "current_industry"
    t.string   "function"
    t.string   "key_skills"
    t.string   "resume_title"
    t.string   "attachment"
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
    t.boolean  "status",               :default => true
    t.string   "content_type"
    t.string   "filename"
  end

  create_table "roles", :force => true do |t|
    t.string   "name"
    t.integer  "resource_id"
    t.string   "resource_type"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  add_index "roles", ["name", "resource_type", "resource_id"], :name => "index_roles_on_name_and_resource_type_and_resource_id"
  add_index "roles", ["name"], :name => "index_roles_on_name"

  create_table "settings", :force => true do |t|
    t.integer  "jobs_per_cat",       :default => 10
    t.string   "site_title",         :default => "Joobsbox"
    t.integer  "job_expr_date_days", :default => 30
    t.string   "timezone",           :default => ""
    t.integer  "rss_in_gen",         :default => 15
    t.integer  "rss_per_cat",        :default => 15
    t.datetime "created_at",                                 :null => false
    t.datetime "updated_at",                                 :null => false
  end

  create_table "themes", :force => true do |t|
    t.string   "name"
    t.string   "template_screen_shot"
    t.boolean  "is_active",            :default => false
    t.datetime "created_at",                              :null => false
    t.datetime "updated_at",                              :null => false
    t.string   "slug"
  end

  create_table "users", :force => true do |t|
    t.string   "email",                  :default => "", :null => false
    t.string   "encrypted_password",     :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
    t.string   "name"
    t.string   "slug"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

  create_table "users_groups", :id => false, :force => true do |t|
    t.integer "user_id"
    t.integer "group_id"
  end

  add_index "users_groups", ["user_id", "group_id"], :name => "index_users_groups_on_user_id_and_group_id"

  create_table "users_roles", :id => false, :force => true do |t|
    t.integer "user_id"
    t.integer "role_id"
  end

  add_index "users_roles", ["user_id", "role_id"], :name => "index_users_roles_on_user_id_and_role_id"

end
