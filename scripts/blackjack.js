var BlackjackView = function(){};

(function(BlackjackView, $) {
  
  BlackjackView.getCardImage = function(card) {
    return "<img src='cards/" + card + ".png' />";
  };

  BlackjackView.dealCards = function(cardCount, domElem, setName) {
     $.ajax({
       type: 'GET',
       dataType: 'text json',
       url: 'http://localhost:4567/cards/' + cardCount,
       success: function(data) {
         var $cardsElem = $(domElem);
         $(data.cards).each(function() {
           var cardElem = BlackjackView.getCardImage(this);
           $cardsElem.append(cardElem);
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
  });

})(BlackjackView, jQuery);
