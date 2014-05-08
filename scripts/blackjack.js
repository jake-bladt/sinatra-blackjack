var BlackjackView = function(){};

(function(BlackjackView, $) {

  var allCards = {
    "player": [],
    "dealer": []
  };

  var record = {
    wins: 0,
    losses: 0,
    ties: 0
  }
  
  BlackjackView.getCardImage = function(card) {
    return "<img src='cards/" + card + ".png' />";
  };

   BlackjackView.displayCard = function(domElem, card) {
     var cardElem = BlackjackView.getCardImage(card);
     domElem.append(cardElem);
   };

   BlackjackView.getCardValue = function(card) {
     var face = card.charAt(0);
     if(face == 'A') return 11;
     if($.inArray(face, ['T','J','Q','K']) > -1) return 10;
     return Number(face);
   };

   BlackjackView.getHandValue = function(cards) {
     var ret = {
       value:  0,
       isSoft: false 
     };

     $(cards).each(function() {
       var cardVal = BlackjackView.getCardValue(this);
       if(cardVal == 11 && ret.isSoft == true) cardVal = 1;
       ret.value += cardVal;
       if(this.charAt(0) == 'A') ret.isSoft = true;
     });

     if(ret.value > 21 && ret.isSoft == true) {
       ret.value -= 10;
       ret.isSoft = false;
     }; 

     return ret;
   };

   BlackjackView.displayHandValue = function(cards) {
     var val = BlackjackView.getHandValue(cards);
     var ret = val.value;
     
     if(val.isSoft == true) ret = "a soft " + ret;
     if(val.value == 21 && cards.length == 2) ret = "blackjack";

     return ret;
   };

   BlackjackView.updateHandValues = function() {
     $('#dealerHead').text('Dealer shows ' + BlackjackView.displayHandValue(allCards['dealer']));
     $('#playerHead').text('You have ' + BlackjackView.displayHandValue(allCards['player']));
   };


  BlackjackView.dealCards = function(cardCount, domElem, setName) {
     $.ajax({
       async: false,
       type: 'GET',
       dataType: 'text json',
       url: 'http://localhost:4567/cards/' + cardCount,
       success: function(data) {
         var $cardsElem = $(domElem);
         $(data.cards).each(function() {
           allCards[setName].push(this);
           BlackjackView.displayCard($cardsElem, this); 
         });
       },
       error: function(xhr, status, err) {
         alert('Failed to draw cards for ' + setName);
       }
     });
   };

   BlackjackView.revealHoleCard = function() {
     $.ajax({
       async: false,
       type: 'GET',
       dataType: 'text json',
       url: 'http://localhost:4567/cards/1',
       success: function(data) {
         $(data.cards).each(function() {
           allCards['dealer'].push(this);
           var $holeCard = $('#holeCard');
           $holeCard.attr('src', 'cards/' + this + '.png' );
         });
       },
       error: function(xhr, status, err) {
         alert('Failed to reveal hole card.');
       }
     });
   };

   BlackjackView.playOutDealerHand = function() {
     var hit = true;
     while(hit == true) {
       var handVal = BlackjackView.getHandValue(allCards['dealer']);
       if(handVal.value > 16) hit = false;
       if(handVal.value == 16 && handVal.isSoft == false) hit = false;
       if(hit == true) {
         BlackjackView.dealCards(1, '#dealerCards', 'dealer');
       }
     }
   };

   BlackjackView.disableUserInput = function() {
     $('#hit').attr('disabled', 'disabled');
     $('#stand').attr('disabled', 'disabled');
   };

   BlackjackView.enableUserInput = function() {
     $('#hit').removeAttr('disabled');
     $('#stand').removeAttr('disabled');
   };

   BlackjackView.hideAgain = function() {
     $('#again').hide();
   };

   BlackjackView.showAgain = function() {
     $('#again').show();
   };

   BlackjackView.updateOnBust = function() {
     BlackjackView.disableUserInput();
   };

   BlackjackView.compareHandValues = function(player, dealer) {
     if(player > 21) return {
       playerWin: false,
       isBust: true,
       isDraw: false
     };

    if(dealer > 21) return {
       playerWin: true,
       isBust: true,
       isDraw: false
     };

     if(player > dealer) return {
       playerWin: true,
       isBust: false,
       isDraw: false
     };

    if(dealer > player) {
      return {
        playerWin: false,
        isBust: false,
        isDraw: false
      };
    } else {
      return {
        playerWin: false,
        isBust: false,
        isDraw: true
      };
   }

   };

   BlackjackView.getRecord = function() {
     return 'Your record is ' + record.wins + '-' +
      record.losses + '-' + record.ties + '.'
   };

   BlackjackView.updateResult = function() {
    var playerHandVal = BlackjackView.getHandValue(allCards['player']);
    var dealerHandVal = BlackjackView.getHandValue(allCards['dealer']);
    var gameResult = BlackjackView.compareHandValues(playerHandVal.value, dealerHandVal.value);

    var resultMsg;

    if(gameResult.isBust == true && gameResult.playerWin == true) resultMsg = "The dealer busted.";
    if(gameResult.isBust == true && gameResult.playerWin == false) resultMsg = "You busted.";
    if(gameResult.isBust == false && gameResult.playerWin == true) resultMsg = "You win.";
    if(gameResult.isBust == false && gameResult.playerWin == false) resultMsg = "You lose.";
    if(gameResult.isDraw == true) resultMsg = "Push.";

    if(gameResult.playerWin == true) {
      record.wins += 1;
    } else {
      if(gameResult.isDraw == true) {
        record.ties += 1;
      } else {
        record.losses += 1;
      }
    }

    $('#resultHead').text(resultMsg + ' ' + BlackjackView.getRecord());
    BlackjackView.showAgain();

   };

  BlackjackView.evaluateBoardState = function() {
    var playerHandVal = BlackjackView.getHandValue(allCards['player']);
    if(playerHandVal.value > 21) {
      BlackjackView.updateOnBust();
      BlackjackView.revealHoleCard();
      BlackjackView.updateResult();
    };

    if(playerHandVal.value == 21) {
      $('#stand').click();
    };
  };

  BlackjackView.resetCards = function() {
    $('#playerCards').empty();
    $('#holeCard').attr('src', 'cards/back.png');
    $('#dealerCards img:not(:first)').remove();
  };

  BlackjackView.dealHands = function() {
    BlackjackView.dealCards(1, '#dealerCards', 'dealer');
    BlackjackView.dealCards(2, '#playerCards', 'player');
  };

  BlackjackView.setInitialState = function() {
      BlackjackView.hideAgain();
      BlackjackView.resetCards();
      BlackjackView.dealHands();
      BlackjackView.evaluateBoardState();
      BlackjackView.updateHandValues();      
  };

  BlackjackView.resetHands = function() {
    allCards = {
      "player": [],
      "dealer": []
    };
  };

  $(document).ready(function() {
    // element behaviors
    $('#hit').click(function(e) {
      e.preventDefault();
      BlackjackView.dealCards(1, '#playerCards', 'player');
      BlackjackView.evaluateBoardState();
      BlackjackView.updateHandValues();
    });

    $('#stand').click(function(e) {
      e.preventDefault();
      BlackjackView.disableUserInput();
      BlackjackView.revealHoleCard();
      BlackjackView.playOutDealerHand();
      BlackjackView.updateHandValues();
      BlackjackView.updateResult(); 
    });

    $('#again').click(function(e) {
      e.preventDefault();
      BlackjackView.enableUserInput();
      BlackjackView.resetHands();
      BlackjackView.setInitialState();
      $('#resultHead').text(BlackjackView.getRecord());
    });

    // Set initial game
    BlackjackView.setInitialState();
  });

})(BlackjackView, jQuery);
