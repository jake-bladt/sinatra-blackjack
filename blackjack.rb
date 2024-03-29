require 'sinatra'
require 'sinatra/json'

class Blackjack < Sinatra::Base
  helpers Sinatra::JSON

  before do
    @faces = "A23456789TJQK".scan(/./)
    @suits = "cdhs".scan(/./)

  	response.headers['Access-Control-Allow-Origin'] = '*'
  	content_type :json
  end

  get '/cards/:count' do
  	cards = []
  	params[:count].to_i.times { cards.push get_card }
  	json :cards => cards
  end

  def get_card
    @faces.sample + @suits.sample
  end

end
