$(document).ready(function() {

    $("#receiveScore").submit(function(event) {
    });
    $("#addScore, #addGame").submit(function(event) {
        event.preventDefault();
        var form = $(this);
        var url = form.attr('action');
        var posting = $.post(url, form.serialize());
        console.log(form.serialize());
        posting.done(function(data) {
            console.log(data);
            // $("#receiveScore").submit();
        });
    });

    populateData();



});

var HOST = "http://pool88.site88.net/php/";

function populateData(){

      // $.get( HOST+"ReceiveScores.php",
      //   { TYPE: "recent", DATERANGE: "year" },
      //   function( data ) {
      //     var asJson = JSON.parse(data);
      //     console.log(asJson);
      //     var jsonQuery = createTable(asJson);
      //     $('#stream-all').html(jsonQuery);
      // });

      // $.get( HOST+"ReceiveScores.php",
      //   { TYPE: "leaderboard", DATERANGE: "year" },
      //   function( data ) {
      //     var asJson = JSON.parse(data);
      //     console.log(asJson);
      //     var jsonQuery = createTable(asJson);
      //     $('#stream-players').html(jsonQuery);
          $('.name').draggable({
              revert:"valid",
              helper:"clone"
          });
      // });

      $.get( HOST+"ReceiveScores.php",
        { TYPE: "player-all", DATERANGE: "year" },
        function( data ) {
          var asJson = JSON.parse(data);
          console.log(asJson);
          var namedrags = $('.name');
          namedrags.draggable({
            start: function() {
              $('.circle').css({opacity:1});
            },
            stop: function() {
              // playerDrag.dropped++;
              if (playerDrag.winner!=='' ||
                  playerDrag.loser!==''){
              }else{
                $('.circle').css({opacity:0});
              }
            },
            snap: ".circle",
              revert:"valid"
              // helper:function(event){
              //   console.log($(this));
              //   return '<div class="name-helper">I am a helper - drag me!</div>';
              // },
          });
          $('.circle').droppable( {
            // accept: '.circle',
            drop: clone
          } );

          function clone(event, ui) {
              var draggable = ui.draggable;
              var playerName =draggable[0]['innerHTML'];
              $(this).html(playerName);
              if ($(this).hasClass('left-circle')){
                playerDrag.winner = playerName;
              }else{
                playerDrag.loser = playerName;
              }
          }
          // var jsonQuery = createTable(asJson);
          // $('#stream-players').html(jsonQuery);
      });
}

var playerDrag = {
  "winner":'',
  "loser":'',
  "dropped":0
}

function handleCardDrop( event, ui ) {
  var slotNumber = $(this).data( 'number' );
  var cardNumber = ui.draggable.data( 'number' );

  // If the card was dropped to the correct slot,
  // change the card colour, position it directly
  // on top of the slot, and prevent it being dragged
  // again

  if ( slotNumber == cardNumber ) {
    ui.draggable.addClass( 'correct' );
    ui.draggable.draggable( 'disable' );
    $(this).droppable( 'disable' );
    ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
    ui.draggable.draggable( 'option', 'revert', false );
    correctCards++;
  }

  // If all the cards have been placed correctly then display a message
  // and reset the cards for another go

  if ( correctCards == 10 ) {
    $('#successMessage').show();
    $('#successMessage').animate( {
      left: '380px',
      top: '200px',
      width: '400px',
      height: '100px',
      opacity: 1
    } );
  }

}

function createTable(mydata) {
    var table = $('<table class="leaderboard" border=0>');
    var tblHeader = "<tr>";
    for (var k in mydata[0]) tblHeader += "<th>" + k + "</th>";
    tblHeader += "</tr>";
    $(tblHeader).appendTo(table);
    $.each(mydata, function (index, value) {
        var TableRow = "<tr>";
        $.each(value, function (key, val) {
          if (key === "NAME")
            TableRow += "<td class='name'>" + val + "</td>";
          else if (key === "WON")
            TableRow += "<td class='num'>" + val + "</td>";
          else if (key === "LOST")
            TableRow += "<td class='num'>" + val + "</td>";
          else
            TableRow += "<td>" + val + "</td>";
        });
        TableRow += "</tr>";
        $(table).append(TableRow);
    });
    return ($(table));
}
