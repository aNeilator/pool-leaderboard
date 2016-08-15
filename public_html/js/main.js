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

      $.get( HOST+"ReceiveScores.php",
        { TYPE: "recent", DATERANGE: "year" },
        function( data ) {
          var asJson = JSON.parse(data);
          console.log(asJson);
          var jsonQuery = createTable(asJson);
          $('#stream-all').html(jsonQuery);
      });

      $.get( HOST+"ReceiveScores.php",
        { TYPE: "leaderboard", DATERANGE: "year" },
        function( data ) {
          var asJson = JSON.parse(data);
          console.log(asJson);
          var jsonQuery = createTable(asJson);
          $('#stream-players').html(jsonQuery);
      });
}

function createTable(mydata) {
    var table = $('<table border=1>');
    var tblHeader = "<tr>";
    for (var k in mydata[0]) tblHeader += "<th>" + k + "</th>";
    tblHeader += "</tr>";
    $(tblHeader).appendTo(table);
    $.each(mydata, function (index, value) {
        var TableRow = "<tr>";
        $.each(value, function (key, val) {
            TableRow += "<td>" + val + "</td>";
        });
        TableRow += "</tr>";
        $(table).append(TableRow);
    });
    return ($(table));
}
