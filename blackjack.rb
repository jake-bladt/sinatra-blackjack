require 'sinatra'
require 'sinatra/json'

class Blackjack < Sinatra::Base
  helpers Sinatra::JSON

  get '/' do
  	json :cards => ['Ah', 'Kd']
  end

end
