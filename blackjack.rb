require 'sinatra'
require 'sinatra/json'

class Blackjack < Sinatra::Base
  helpers Sinatra::JSON

  before do
  	response.headers['Access-Control-Allow-Origin'] = '*'
  	content_type :json
  end

  get '/cards' do
  	json :cards => ['AH', '9C']
  end

end
