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

ActiveRecord::Schema.define(:version => 20110413065100) do

  create_table "carousels", :force => true do |t|
    t.string   "visibility",           :default => "invisible"
    t.string   "c_image_file_name"
    t.string   "c_image_content_type"
    t.string   "action"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "contacts", :force => true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "phone"
    t.text     "message"
    t.string   "status",      :default => "unread"
    t.string   "mail_status", :default => "unsent"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "involvements", :force => true do |t|
    t.integer  "member_id"
    t.integer  "project_id"
    t.string   "status",     :default => "current"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "members", :force => true do |t|
    t.string   "name",                                      :null => false
    t.string   "name_eng"
    t.string   "tags",                 :default => ""
    t.string   "skills",               :default => ""
    t.string   "school",               :default => ""
    t.string   "email",                :default => ""
    t.string   "website",              :default => ""
    t.string   "twitter",              :default => ""
    t.text     "comment",              :default => ""
    t.string   "resume_file_name"
    t.string   "resume_content_type"
    t.string   "list1_file_name"
    t.string   "list1_content_type"
    t.string   "list2_file_name"
    t.string   "list2_content_type"
    t.string   "profile_file_name"
    t.string   "profile_content_type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "grade",                :default => "cream"
  end

  create_table "members_projects", :id => false, :force => true do |t|
    t.integer "member_id"
    t.integer "project_id"
  end

  create_table "projects", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.date     "start_date"
    t.string   "status",      :default => "on"
    t.string   "link"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "subtitle"
  end

  create_table "screenshots", :force => true do |t|
    t.integer  "project_id"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "featuring_id"
    t.integer  "logo_of_id"
  end

  create_table "timelines", :force => true do |t|
    t.string   "name"
    t.date     "took_place_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
