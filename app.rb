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
      check = true if word.size >= MIN_WORD_SIZE && word.size <= MAX_WORD_SIZE
    end while check != true

    return word.downcase 
  end

end

DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/tftproj1.db")

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

class Level
  include DataMapper::Resource
  property :id, Serial # change property name to levelNum before populating table
  property :levelNum, Integer # remove before populating
  property :startX, Integer
  property :startY, Integer
  property :winXleft, Integer
  property :winXright, Integer
  property :winYtop, Integer
  property :winYbottom, Integer
end

DataMapper.finalize.auto_upgrade!

get '/' do
  erb :home
end

#TODO The Levels table needs to be populated and the following code changed to use the Levels table.
get '/maze/:level' do
  # @level = Level.get params[:level]

  @level = Level.new
  @level.levelNum = 1
  @level.startX = 1
  @level.startY = 266
  @level.winXleft = 458
  @level.winXright = 482
  @level.winYtop = 105
  @level.winYbottom = 144
  
  erb ACTIVITY_1.to_sym
end

get '/hangman/word/?' do
  getWord
end

post '/user/:username' do
  params[:username] #TODO create new user
end

put '/user/:username' do
  "todo" #TODO update user password
end

get '/:activity/?' do
  if ACTIVITIES.include? (HTMLEntities.new.decode params[:activity])
    if HTMLEntities.new.decode(params[:activity]) == ACTIVITY_1
      redirect '/maze/1'
    else
      erb params[:activity].to_sym
    end
  else
    erb :'404'
  end
end

get '/404' do
  erb :'404'
end

not_found do
  erb :'404'
end