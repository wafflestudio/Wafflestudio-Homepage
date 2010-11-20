# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)

me = Member.create({:name => '황호성', :name_eng => 'Hoseong Hwang', :school => '서울대학교 컴퓨터공학부 08'})
me.projects << Project.new(:name => 'SNUEV')
