require 'sinatra'
require 'data_mapper'
require 'htmlentities'

SITE_TITLE = "TeamFourTech Project 1"

ACTIVITY_1 = "The Maze"
ACTIVITY_2 = "Round Pong"
ACTIVITY_3 = "Whack-a-Mole"
ACTIVITY_4 = "Hangman"

ACTIVITIES = [ACTIVITY_1, ACTIVITY_2, ACTIVITY_3, ACTIVITY_4]

MIN_WORD_SIZE = 4
MAX_WORD_SIZE = 8

helpers do
  include Rack::Utils
  alias_method :h, :escape_html

  def getWord
    f = File.open('words.txt').readlines

    check = false

    begin
      word = f[rand(f.length)]

      if word.size >= MIN_WORD_SIZE && word.size <= MAX_WORD_SIZE
        check = true
      end
    end while check != true
    
    return word.downcase 
  end
end

DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/user.db")

class User
  include DataMapper::Resource
  property :id, Serial
  property :username, Text, :required => true
  property :password, BCryptHash, :required => true
  property :time1, Integer
  property :time2, Integer
  property :time3, Integer
  property :time4, Integer
  property :loginTime, Integer
  property :logins, Integer
  property :admin, Integer
end

DataMapper.finalize.auto_upgrade!

get '/' do
  erb :home
end

get '/:activity/?' do
  if ACTIVITIES.include? (HTMLEntities.new.decode params[:activity])
    erb params[:activity].to_sym
  else
    erb :'404'
  end
end

get '/hangman/word/?' do
  getWord
end

post '/user/:username' do
  params[:username]
end

put '/user/:username' do
  "todo"
end


get '/404' do
  erb :'404'
end

not_found do
  erb :'404'
end