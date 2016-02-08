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
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160208060533) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "carousels", force: :cascade do |t|
    t.text     "visibility",           default: "invisible"
    t.text     "c_image_file_name"
    t.text     "c_image_content_type"
    t.text     "action"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "contacts", force: :cascade do |t|
    t.text     "name"
    t.text     "email"
    t.text     "phone"
    t.text     "message"
    t.text     "status",      default: "unread"
    t.text     "mail_status", default: "unsent"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "involvements", force: :cascade do |t|
    t.integer  "member_id"
    t.integer  "project_id"
    t.text     "status",     default: "current"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "members", force: :cascade do |t|
    t.text     "name",                                   null: false
    t.text     "name_eng"
    t.text     "tags",                 default: ""
    t.text     "skills",               default: ""
    t.text     "school",               default: ""
    t.text     "email",                default: ""
    t.text     "website",              default: ""
    t.text     "twitter",              default: ""
    t.text     "comment",              default: ""
    t.text     "resume_file_name"
    t.text     "resume_content_type"
    t.text     "list1_file_name"
    t.text     "list1_content_type"
    t.text     "list2_file_name"
    t.text     "list2_content_type"
    t.text     "profile_file_name"
    t.text     "profile_content_type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "grade",                default: "cream"
    t.boolean  "is_visible",           default: true
    t.integer  "group"
  end

  create_table "members_projects", id: false, force: :cascade do |t|
    t.integer "member_id"
    t.integer "project_id"
  end

  create_table "projects", force: :cascade do |t|
    t.text     "name"
    t.text     "description"
    t.date     "start_date"
    t.text     "status",      default: "on"
    t.text     "link"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "subtitle"
    t.boolean  "is_visible",  default: true
  end

  create_table "screenshots", force: :cascade do |t|
    t.integer  "project_id"
    t.text     "image_file_name"
    t.text     "image_content_type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "featuring_id"
    t.integer  "logo_of_id"
  end

  create_table "timelines", force: :cascade do |t|
    t.text     "name"
    t.date     "took_place_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
