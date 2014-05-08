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
       ret.value += BlackjackView.getCardValue(this);
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

  $(document).ready(function() {
    // element behaviors
    $('#hit').click(function(e) {
      e.preventDefault();
      BlackjackView.dealCards(1, '#playerCards', 'player');
      BlackjackView.updateHandValues();
    });

    $('#stand').click(function(e) {
      e.preventDefault();
      BlackjackView.revealHoleCard();
      BlackjackView.playOutDealerHand();
      BlackjackView.updateHandValues(); 
    });

    // Set initial game
    BlackjackView.dealCards(1, '#dealerCards', 'dealer');
    BlackjackView.dealCards(2, '#playerCards', 'player');
    BlackjackView.updateHandValues();
  });

})(BlackjackView, jQuery);
