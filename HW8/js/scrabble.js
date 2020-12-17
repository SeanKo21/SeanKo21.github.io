/*
Title: Assignment 8
Name: Zion "Sean" Ko
Email: zion_ko@student.uml.edu
Affiliation: Umass Lowell COMP 4610 Sec 201 GUI Programming 1
Last update: 2020-12-16
Description: Using JavaScript and JQuery to make SCRABBLE game.
Sources: mostly from html cheatsheet, textbook, and notes.
  1. https://www.w3schools.com/js/js_htmldom.asp
  2. https://javascript.info/dom-nodes
  3. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions
  4. https://www.learn-js.org
  5. https://javascript.info
  6. https://jqueryvalidation.org/documentation/
  7. https://stackoverflow.com/questions/885144/how-to-get-current-position-of-an-image-in-jquery
  8. https://stackoverflow.com/questions/9704087/jquery-add-image-at-specific-co-ordinates
*/

$().ready(function () {
    tileSelector(); // selects the seven tiles for the user.

    initDrag(); // initialize tiles so it can be draggable.

    $("form").on("submit", function(event) {
        event.preventDefault(); // jquery implementation to prevent default behavior submit button
    });

    $("#form-button").on("click", function(event) {
        nextTurn(); // jquery to take care of the next turn button
    });

    $("#reset-button").on("click", function(event) {
        location.reload();  // this will reload the page to reset the game
    });
});

// This function will initialize tiles so they can be draggable
function initDrag() {
    $('.ui-draggable').draggable({  // makes tiles so the user can drag them.
        revert: "invalid"   // makes the tile go back to the rack when it is dragged onto invalid locations
    });

    $('.ui-droppable').droppable({  // makes the board so the user can drop tiles on to it.
        drop: function (event, ui) {
            var $this = $(this);
            // makes tiles to land on the center of a block
            ui.draggable.position({
                my: "center",
                at: "center",
                of: $this,
                using: function(pos) {
                    $(this).animate(pos, 200, "linear");
                }
            });

            // Now I am going to use the regular expression to extract the positions of the board and their id
            // Then it will match the regular expression, and I need to convert str into int
            var regExp = new RegExp(".*tile-([a-z]|_)");
            var char = ui.draggable.attr('class').match(regExp)[1];
            var tileIDs = parseInt(ui.draggable.attr('id'));
            var boardIDs = event.target.id; // get the board id
            // use regular expression to board or block
            var boardRegExp = new RegExp("tile-([0-9]+)");
            var squareRegExp = new RegExp("block-([0-9]+)");
            var REmatch = boardIDs.match(boardRegExp);  // match the board
            if(REmatch) {   // matches, then the tile is deleted on the board and add onto user tiles. Then call a function
                            // that delete the letter.
                letterDestroyer(parseInt(REmatch[1]), tileIDs, char);
            } else {    // else, the tile needs to be kept for the scrabble game row
                var SQmatch = boardIDs.match(squareRegExp);
                letterCounter(parseInt(SQmatch[1]), tileIDs, char); // counting the tile number
            }

        }
    });
}

// This is when the "Next Turn" button is clicked
function nextTurn() {
    if (!boardChecker()) {  // If the player did not move any tiles onto the board. Then prints out an error message
        document.getElementById("error-message").innerHTML = "Error: You did not make a move!";
    } else if (rowChecker()) {  // If the player made a move
        totalTurn += 1; // turn counter 1+
        totalScore += addScroe();   // adds the score
        tileManager();  // tileManage would be called to invalidate used tiles
        document.getElementById("error-message").innerHTML = "";    // no error message
        document.getElementById("turn-counter").innerHTML = "TURN: " + totalTurn;   // outputs current turn count
        document.getElementById("userscore").innerHTML = "YOUR SCORE: " + totalScore; //outputs current score
        // initDrag();
        gapFiller();    // calls gapFiller fill in possible lost tiles.
        copiedObj = boardObj;   // update the board.
    } else {    // another error message if there is a gap between user's word submission
        document.getElementById("error-message").innerHTML = "Error: No gaps between letters!";
    }
}

// Checks if the tiles are in row
function rowChecker() {
    var gap = false;
    var startWord = false;
    for(i = 0; i < 15; i++) {
        var current = $.grep(boardObj, function(e) {return e.boardPos === i});  // gets the position
        if (current.length == 1 && startWord == true) {  // checks to see if the element has been used.
                return false;
        } else if (current.length == 0 && gap == true) {
            startWord = true;
        } else if (current.length == 1 && gap == false) {
            gap = true;
        }
    }
    return true;
}


// This function will calculate and add up all scores.
function addScroe() {
    var totalScore = 0;
    var temp = 0;
    var bonusWord = 0;
    var bonusLetter = false;
    var bonusStop = false;
    for (i = 0; i < 15; i++) {
        var current = $.grep(boardObj, function(e) {return e.boardPos === i});  // gets the current element position
        if (current.length == 1) {  // for the current element
            if (bonusStop == false) {   // checks if letters are chained together
                bonusStop == true;
            }
            if (i == 0 || i == 7 || i == 14) {  // Bonus words are taken care of
                bonusWord++;
            } else if (i == 3 || i == 11) { // Bonus letters are taken care of
                bonusLetter = true;
            }
            temp += letterValueGetter(current[0].charVal); // store the each letter score into the temp
            if (bonusLetter) {  // so if there is a bonus letter score, increase the score for that letter
                temp += letterValueGetter(current[0].charVal);
                bonusLetter = false;
            }
        } else if (bonusStop) { // if there is a gap between words
            if (bonusWord > 0) { // bonus word are considered
                temp = temp * bonusWord * 3;
                bonusWord = 0;
            }
            bonusStop = false;  // set bonusStop
            totalScore += temp; // adds up the score
            temp = 0; // and reset the temp score since there is a stop
        } else {
            if (bonusWord > 0) {    // reset the bonus scoring
                temp = temp * bonusWord * 3;
                bonusWord = 0;
            }
            totalScore += temp; // calculate the total score when the bonus stops
            temp = 0;
        }
    }
    if (bonusWord > 0) {   // final check for any bonus
        temp = temp * bonusWord * 3;
        totalScore += temp;
    }
    return totalScore;
}


// This functions gets the letter value by comparing if characters match
function letterValueGetter(char) {
    if (char == '_') {
        return 0;
    } else if (char == 'e' || char == 'a' || char == 'i' || char == 'o' || char == 'n' || char == 'r' || char == 't' || char == 'l' || char == 's' || char == 'u') {
        return 1;
    } else if (char == 'd' || char == 'g') {
        return 2;
    } else if (char == 'b' || char == 'c' || char == 'm' || char == 'p') {
        return 3;
    } else if (char == 'f' || char == 'h' || char == 'v' || char == 'w' || char == 'y') {
        return 4;
    } else if (char == 'k') {
        return 5;
    } else if (char == 'j' || char == 'x') {
        return 8;
    } else {
        return 10;
    }
}

// This function will stop and flags any used up tiles by the player.
function tileManager() {
    boardObj.forEach( function(x) {
       x.immobile = true;   // marking tile so i can be checked later
        var $idT = '#' + x.tileId;
        $($idT).draggable("disable");    // stops used up tiles
        var $boardIDs = '#block-' + x.boardPos;
        $($boardIDs).droppable("disable");  // overlapping future tiles is prevented
    });
}

// setting up the variable so I could get the occurrence of each tiles
var allTiles = "aaaaaaaaabbccddddeeeeeeeeeeeeffggghhiiiiiiiiijkllllmmnnnnnnooooooooppqrrrrrrssssttttttuuuuvvwwxyyz__";

// This function will mix up tiles for the player
function mixTiles (item) {
    if (item.length == 0) {     // if tiles are all gone, return 0, End of game
        return 0;
    }
    var i = Math.floor(Math.random() * item.length);  // taking the modulus of a radmoized number so it does not go over the array
    var pickedLetter = item.charAt(i); // selects the letter
    allTiles = item.slice(0,i) + item.slice(i+1, item.length); // removes the chosen letter so distribution makes sense
    return pickedLetter;
}

// This function will select seven tiles for the user
// just simple looping to generate tiles 7 times.
function tileSelector () {
    var i;
    for(i=0; i < 7; i++) {
        tileGenerator(i);
    }
}

// This function generates the tile on the chosen position.
function tileGenerator (i) {
    var currentTile = document.createElement('div');    // intializeing tile
    var letter = mixTiles(allTiles);    // chooses the letter from randomized tiles
    currentTile.className = 'tile tile-' + letter + ' ui-draggable ui-draggable-handle'; // intialize the class name with the selected letters
    currentTile.style = "position: relative;";  // letters are position relative
    currentTile.id = totalTileID;   // unique ID is created for each tile
    $('.tile-set')[i].append(currentTile); // makes an tile object to keep track.
    var shoveTile = { boardPos: i, tileId : totalTileID, charVal: letter, immobile: false};
    tileObj.push(shoveTile);    // pushing into the array
    totalTileID++; // increase the unique ID.
}

// setting variables for objects and some counters
var tileObj = [];
var boardObj = [];
var copiedObj = [];
var totalTileID = 0;
var totalScore = 0;
var totalTurn = 0;

// This function will check  if it is in the board or at user
function letterCounter(boardid, tileid, char) {
    var shoveTile = { boardPos: boardid, tileId : tileid, charVal: char, immobile: false };
    tileObj = $.grep(tileObj, function(e){
                      return e.tileId != tileid;
                      });

    var result = $.grep(boardObj, function(e){ return e.tileId == tileid; });
    if (result.length != 0) {
        var $temp = '#block-' + result[0].boardPos;
        $($temp).droppable("enable");
    }
    boardObj = $.grep(boardObj, function(e){
                          return e.tileId != tileid;
                          });

    boardObj.push(shoveTile);

    var $boardid = '#block-' + boardid;
    $($boardid).droppable("disable");
}

// This will act as a deleter if the user puts the tile back to the rack from the board.
// However, if cannot be done for the previous turns once the user clicks on the next turn.
function letterDestroyer(boardid, tileid, char) {
    var shoveTile = { boardPos: boardid, tileId : tileid, charVal: char, immobile: false };
    tileObj.push(shoveTile);
    var result = $.grep(boardObj, function(e){ return e.tileId == tileid; });
    if (result.length != 0) {
        var $temp = '#block-' + result[0].boardPos;
        $($temp).droppable("enable");
    }
    boardObj = $.grep(boardObj, function(e){
                          return e.tileId != tileid;
                          });
}

// This function just fills if there is a gap between submmitted words.
function gapFiller() {
    var arr = [];
    tileObj.forEach( function(x) {
        arr.push(x.boardPos);
    });
    for (i=0; i < 7; i++) {
        if($.inArray(i, arr) == -1) {
            tileGenerator(i);
        }
    }
    $('.ui-draggable').draggable({
        revert: "invalid"
    });
}

// checks if the board is modified or not by dropping tiles in it.
function boardChecker() {
    if (boardObj.length == copiedObj.length) {
        return false;
    } else {
        return true;
    }
}
