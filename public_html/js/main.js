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

function pullPhp(){

  $.get( HOST+"ReceiveScores.php",
    { TYPE: "leaderboard", DATERANGE: "year" },
    function( data ) {
      var asJson = JSON.parse(data);
      console.log(asJson);
      var jsonQuery = createTable(asJson);
      $('#stream-players').html(jsonQuery);
      namedrags = $('.name');
      setDraggables();
      // $.get( HOST+"ReceiveScores.php",
      //   { TYPE: "recent", DATERANGE: "year" },
      //   function( data ) {
      //     var asJson = JSON.parse(data);
      //     console.log(asJson);
      //     var jsonQuery = createTable(asJson);
      //     $('#stream-all').html(jsonQuery);
      // });
  });
}

var namedrags;

function setDraggables(){

  namedrags.draggable({
    start: function() {
      $('.circle').css({opacity:1});
      $(this).css({opacity:0.5});
    },
    stop: function() {

      var uid = $(this)[0]['htmlFor'];
      var curr = $(this);
      resetNameDrag(uid, curr);

    },
    snap: ".circle",
    snapMode: "inner" ,
    revert:"invalid",
    helper: "clone"
  });
  namedrags.draggable("enable");
}

function populateData(){
  namedrags = $('.name');
  pullPhp();
  // setDraggables();

  $('.circle').droppable( {
    // accept: '.circle',
    drop: function(event, ui){

      var draggable = ui.draggable[0];
      var playerName =draggable['innerHTML'];

      if ($(this).hasClass('left-circle')){
        setNameChosen(true, true, draggable['htmlFor'], playerName);
      }else if ($(this).hasClass('right-circle')){
        setNameChosen(false, true, draggable['htmlFor'], playerName);
      }

    },
    hoverClass: 'hovered-blink'
  });

  // });

  $('#cancel-right').click( function() {
      setNameChosen(false, false, playerDrag.loser, '');
  });
  $('#cancel-left').click( function() {
      setNameChosen(true, false, playerDrag.winner, '');
  });
  $('#add-name-button').click( function() {
    if (playerDrag.winner=== '' || playerDrag.loser==='') return false;

    $.post( HOST+"AddGame.php",
      {
        PASS: "pass",
        WINNER: playerDrag.winner,
        LOSER: playerDrag.loser,
        DRUNK: 0
      },
      function( data ) {
        console.log(data);
        setNameChosen(false, false, playerDrag.loser, '');
        setNameChosen(true, false, playerDrag.winner, '');
        pullPhp();

      }
    );
  });
}

function resetNameDrag(uid, curr){

  //both added
  if (playerDrag.winner!=='' && playerDrag.loser!==''){
    namedrags.draggable("disable");
    $('.button-add button').css({opacity:1});
  }
  //one of them added
  else if (playerDrag.winner!=='' || playerDrag.loser!==''){
    namedrags.draggable("enable");
  }
  //both of them empty
  else if (playerDrag.winner=== '' && playerDrag.loser===''){
    $('.circle').css({opacity:0});
  }


  if (playerDrag.winner=== uid || playerDrag.loser===uid){
    curr.draggable( "disable" );
    // curr.css({opacity:0.4});
  } else{
    curr.css({opacity:1});
    curr.draggable("enable");
  }
}

var playerDrag = {
  "winner":'',
  "loser":'',
}

function setNameChosen(isWinner, isChosen, uid, playerName) {
  if (isChosen){
    if (isWinner){
      playerDrag.winner = uid;
      $('#add-name-left').text(playerName);
    } else{
      playerDrag.loser = uid;
      $('#add-name-right').text (playerName);
    }
  }else{
    var ll = $("label[for='"+uid+"']");

    if (isWinner){
      playerDrag.winner = '';
      $('#add-name-left').text ('');
    } else{
      $('#add-name-right').text ('');
      playerDrag.loser = '';

    }
    resetNameDrag(uid, ll);
  }
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
    for (var k in mydata[0]) {
      if (k==="ID") continue;
      tblHeader += "<th>" + k + "</th>";
    }
    tblHeader += "</tr>";
    $(tblHeader).appendTo(table);
    var setNewPlayerNow = false;
    var newPPos = 0;
    $.each(mydata, function (index, value1) {
        var TableRow = "<tr>";
        $.each(value1, function (key, val) {
          if (key === "ID") return true;
          if (key === "NAME")
            TableRow += "<td><label class='name' for='"+
            value1.ID+"'>" + val + "</label></td>";
          else if (key === "WON")
            TableRow += "<td class='num'>" + val + "</td>";
          else if (key === "LOST")
            TableRow += "<td class='num'>" + val + "</td>";
          else if (key === "SCORE"){
            if (val<newPPos && setNewPlayerNow==false){
              setNewPlayerNow=true;
              newPPos = -100000;
            }
            TableRow += "<td>" + val + "</td>";
          }
          else{
            TableRow += "<td>" + val + "</td>";
          }
        });
        if (setNewPlayerNow){
          var str ="<td> </td><td> Add new Player </td><td></td><td></td><td></td>";
          $(table).append("<tr class='add-player'>"+str+"</tr>");
          setNewPlayerNow = false;
        }
        TableRow += "</tr>";
        $(table).append(TableRow);
    });
    return ($(table));
}
