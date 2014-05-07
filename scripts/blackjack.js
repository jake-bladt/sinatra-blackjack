var BlackjackView = function(){};

(function(BlackjackView, $) {

  var allCards = {
    "player": [],
    "dealer": []
  };
  
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

  // Set initial game
  $(document).ready(function() {
    BlackjackView.dealCards(1, '#dealerCards', 'dealer');
    BlackjackView.dealCards(2, '#playerCards', 'player');
    BlackjackView.updateHandValues();
  });

})(BlackjackView, jQuery);
