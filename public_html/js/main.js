$(document).ready(function() {
    initialise();
    pullLeaderboard();
});


var HOST_PHP = "http://pool88.site88.net/php/";
var tableUpdateNum = 0;
var namedrags;
var GPLAYERS = {
    "winner": '',
    "loser": ''
}

function initialise() {


    $('.circle').droppable({
        // accept: '.circle',
        drop: function(event, ui) {

            var draggable = ui.draggable[0];
            var playerName = draggable['innerHTML'];

            if ($(this).hasClass('left-circle')) {
                GAME.setNameChosen(true, true, draggable['htmlFor'], playerName);
            } else if ($(this).hasClass('right-circle')) {
                GAME.setNameChosen(false, true, draggable['htmlFor'], playerName);
            }

        },
        hoverClass: 'hovered-blink'
    });

    // });


    $('#cancel-right').click(function() {
        GAME.setNameChosen(false, false, GPLAYERS.loser, '');
    });
    $('#cancel-left').click(function() {
        GAME.setNameChosen(true, false, GPLAYERS.winner, '');
    });
    $('#add-name-button').click(function() {
        if (GPLAYERS.winner === '' || GPLAYERS.loser === '') return false;
        UI.loaderToggle(true);
        php.addGame();
    });

    $('#add-uid').on('change keyup paste', function() {
        var value = $(this).val();
        var flname = value.split('.');
        console.log(flname);
        $('#add-fname').val(flname[0].capitalizeFirstLetter());
        $('#add-lname').val(flname[1].capitalizeFirstLetter());
    });
}

function pullLeaderboard() {
    UI.loaderToggle(true);
    php.getLeaderboard();
}

var GAME = {
    setDraggables: function() {
        namedrags.draggable({
            start: function() {
                $('.circle').css({
                    opacity: 1
                });
                $(this).css({
                    opacity: 0.5
                });
            },
            stop: function() {

                var uid = $(this)[0]['htmlFor'];
                var curr = $(this);
                GAME.resetNameDrag(uid, curr);
            },
            snap: ".circle",
            snapMode: "inner",
            revert: "invalid",
            helper: "clone"
        });
        namedrags.draggable("enable");
    },

    resetNameDrag: function(uid, curr) {

        //both added
        if (GPLAYERS.winner !== '' && GPLAYERS.loser !== '') {
            namedrags.draggable("disable");
            $('.button-add button').css({
                opacity: 1
            });
        }
        //one of them added
        else if (GPLAYERS.winner !== '' || GPLAYERS.loser !== '') {
            namedrags.draggable("enable");
        }
        //both of them empty
        else if (GPLAYERS.winner === '' && GPLAYERS.loser === '') {
            $('.circle').css({
                opacity: 0
            });
        }


        if (GPLAYERS.winner === uid || GPLAYERS.loser === uid) {
            curr.draggable("disable");
            // curr.css({opacity:0.4});
        } else {
            curr.css({
                opacity: 1
            });
            curr.draggable("enable");
        }
    },
    setNameChosen: function(isWinner, isChosen, uid, playerName) {
        if (isChosen) {
            if (isWinner) {
                GPLAYERS.winner = uid;
                $('#add-name-left').text(playerName);
            } else {
                GPLAYERS.loser = uid;
                $('#add-name-right').text(playerName);
            }
        } else {
            var ll = $("label[for='" + uid + "']");

            if (isWinner) {
                GPLAYERS.winner = '';
                $('#add-name-left').text('');
            } else {
                $('#add-name-right').text('');
                GPLAYERS.loser = '';

            }
            GAME.resetNameDrag(uid, ll);
        }
    },

    handleCardDrop: function(event, ui) {
        var slotNumber = $(this).data('number');
        var cardNumber = ui.draggable.data('number');

        // If the card was dropped to the correct slot,
        // change the card colour, position it directly
        // on top of the slot, and prevent it being dragged
        // again

        if (slotNumber == cardNumber) {
            ui.draggable.addClass('correct');
            ui.draggable.draggable('disable');
            $(this).droppable('disable');
            ui.draggable.position({
                of: $(this),
                my: 'left top',
                at: 'left top'
            });
            ui.draggable.draggable('option', 'revert', false);
            correctCards++;
        }

        // If all the cards have been placed correctly then display a message
        // and reset the cards for another go

        if (correctCards == 10) {
            $('#successMessage').show();
            $('#successMessage').animate({
                left: '380px',
                top: '200px',
                width: '400px',
                height: '100px',
                opacity: 1
            });
        }

    }
}

var UI = {

    loaderToggle: function(show) {
        var loader = $('#loader');
        if (show == true) {
            loader.show();
        } else {
            loader.hide();
        }
    },

    sendAddPlayer: function() {
        php.addPlayer();
    },

	addPlayerViewToggle: function() {
	    $('.add-player-overlay').toggle();
	}
	,

	createTable: function(mydata) {
	    $('#stream-players').html('<table id="leader-table" class="leaderboard " border=0>');
	    var table = $('#leader-table');
	    var tblHeader = "<thead><tr>";
	    for (var k in mydata[0]) {
	        if (k === "ID") continue;
	        tblHeader += "<th>" + k + "</th>";
	    }
	    tblHeader += "</tr></thead>";
	    $(tblHeader).appendTo(table);
	    var setNewPlayerNow = false;
	    var newPPos = 0;
	    $.each(mydata, function(index, value1) {
	        var TableRow = "<tr>";
	        $.each(value1, function(key, val) {
	            if (key === "ID") return true;
	            if (key === "NAME")
	                TableRow += "<td><label class='name' for='" +
	                value1.ID + "'>" + val + "</label></td>";
	            else if (key === "WON")
	                TableRow += "<td class='num'>" + val + "</td>";
	            else if (key === "LOST")
	                TableRow += "<td class='num'>" + val + "</td>";
	            else if (key === "SCORE") {
	                if (val < newPPos && setNewPlayerNow == false) {
	                    setNewPlayerNow = true;
	                    newPPos = -100000;
	                }
	                TableRow += "<td>" + val + "</td>";
	            } else {
	                TableRow += "<td>" + val + "</td>";
	            }
	        });
	        if (setNewPlayerNow) {
	            var str = "<td> </td><td> Add new Player </td><td></td><td></td><td></td>";
	            // table.append("<tr onclick='UI.addPlayerViewToggle()' class='add-player'>"+str+"</tr>");
	            setNewPlayerNow = false;
	        }
	        TableRow += "</tr>";
	        table.append(TableRow);
	    });
	    // table.tableSort();
	    // return (table));
	}


}

var php = {


    addGame: function() {
        $.post(HOST_PHP + "AddGame.php", {
                PASS: "pass",
                WINNER: GPLAYERS.winner,
                LOSER: GPLAYERS.loser,
                DRUNK: 0
            },
            function(data) {
                console.log(data);
                GAME.setNameChosen(false, false, GPLAYERS.loser, '');
                GAME.setNameChosen(true, false, GPLAYERS.winner, '');
                pullLeaderboard();
            }
        );
    },

    addPlayer: function() {
        $.post(HOST_PHP + "AddPlayer.php", {
                PASS: "pass",
                UID: $('#add-uid').val(),
                FNAME: $('#add-fname').val(),
                LNAME: $('#add-lname').val()
            },
            function(data) {
                console.log(data);
                pullLeaderboard();
                UI.addPlayerViewToggle();
            }
        );
    },

    getLeaderboard: function() {
        $.get(HOST_PHP + "ReceiveScores.php", {
                TYPE: "leaderboard",
                DATERANGE: "year"
            },
            function(data) {
                var asJson = JSON.parse(data);
                console.log(asJson);
                UI.createTable(asJson);
                $('#leader-table').tableSort({
                    sortBy: ['numeric', 'text', 'numeric', 'numeric', 'numeric']
                });
                if (tableUpdateNum == 0) {}
                UI.loaderToggle(false);
                namedrags = $('.name');
                GAME.setDraggables();
            });
    }

}


String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
