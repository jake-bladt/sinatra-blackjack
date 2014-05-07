require 'sinatra'
require 'sinatra/json'

class Blackjack < Sinatra::Base
  helpers Sinatra::JSON

  get '/cards' do
  	response.headers['Access-Control-Allow-Origin'] = '*'
  	content_type :json
  	json :cards => ['Ah', 'Kd']
  end

end
