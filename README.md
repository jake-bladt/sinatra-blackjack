## Sinatra Blackjack
A simple blackjack server written in Sinatra. This project is meant to demonstrate some basic JavaScript and Ruby.

This isn't a perfect blackjack simulator. It misses some edge cases.

### Installing
To run under vagrant, type:
```
  vagrant up
  vagrant ssh
```

Install the required gems:
```
  gem install sinatra
  gem install sinatra-contrib
  gem install thin
```

To run on your local machine, type:
```
  rackup
```

To run on a vagrant VM, type:
```
  rackup -p 3000
```

(The above will be port forwarded to port 4567, Sinatra's default.)

Once the card service is up and running, open index.html on your desktop in any modern browser. All of the blackjack-related business rules are defined in blackjack.js.

Cards courtesy of jfitz.com
