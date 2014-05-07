var BlackjackView = function(){}

(function(BlackjackView, $) {

    $(document).ready(function() {
       $.ajax({
         type: 'GET',
         dataType: 'text json',
         url: 'http://localhost:4567/cards/3',
         success: function(data) {
           var $myCards = $('#myCards');
           $(data.cards).each(function() {
             var cardElem = "<img src='cards/" + this + ".png' />"
             $myCards.append(cardElem);
           });
         },
         error: function(xhr, status, err) {
           alert(status + ': ' + err + '. ' + xhr.responseText);
         }
       });
    });

})(BlackjackView, jQuery);
