/**
 * This file contains code for manipulating the gui
 * while entering, running, and exiting game mode.
 */

// internal variable that stores the currently active game table cell
var currentGameTableCell = null;

////////////////////////////////////////////////////////////////////////////////
// Code to manipulate the game table
////////////////////////////////////////////////////////////////////////////////

/**
 * Generates the game table from the currently
 * loaded game, but does not add it to the DOM.
 */
function createGameTable() {
    // create the table
    var table = document.createElement("table");

    var headerRow = document.createElement("tr");
    table.appendChild(headerRow);

    // get all categories
    var catContainers = document.getElementById("main-content")
                                .getElementsByClassName("category-container");

    // some bookkeeping variables: the dimensions of the table
    var rows = 0, cols = 0;

    for (var category = 0; category < catContainers.length; category++) {
        cols++;

        // add the header
        var header = createGameHeader(catContainers[category]);
        headerRow.appendChild(header);

        // get all questions and sort by value
        var qaContainers = [].slice.call(catContainers[category]
            .getElementsByClassName("category-qas")[0]
            .getElementsByClassName("qa-container"))
            .sort(function (qa1, qa2) {
                return getQaValue(qa1) - getQaValue(qa2);
            } );

        var currentRows = 0; // how many rows encountered in the current category

        for (var qa = 0; qa < qaContainers.length; qa++) {
            currentRows++;

            // if there are not enought rows, add more
            if (currentRows > rows) {
                rows++;

                table.appendChild(document.createElement("tr"));

                // fill in the "bald spots"
                for (var i = 0; i < cols-1; i++){
                    table.childNodes[currentRows].appendChild(document.createElement("td"));
                }
            }

            // create a new cell
            var cell = createGameCell(qaContainers[qa]);

            // add this question to the row
            table.childNodes[currentRows].appendChild(cell);
        }

        // fill in more "bald spots"
        for (var i = qaContainers.length + 1; i <= rows; i++) {
            table.childNodes[i].appendChild(document.createElement("td"));
        }
    }

    // return the table
    return table;
}

/**
 * Generates the <th> element of the game mode table.
 * This is a helper method for the createGameTable method.
 */
function createGameHeader(ele) {
    var head = document.createElement("th");
    head.innerHTML = ele.getElementsByClassName("category-head")[0]
                        .getElementsByTagName("input")[0]
                        .value;

    if (head.innerHTML == "") {
        head.innerHTML = "---";
    }

    return head;
}

/**
 * Generates the <td> element of the game mode table.
 * This is a helper method for the createGameTable method.
 * These elements call the right methods onclick to show
 * the question.
 */
function createGameCell(ele) {
    var cell = document.createElement("td");

    var value = getQaValue(ele);
    var question = ele.getElementsByTagName("textarea")[0].value;
    var answer = ele.getElementsByTagName("textarea")[1].value;

    if (value === null || value === undefined || isNaN(value)) {
        value = "---";
    }

    if (question == "") {
        question = "No question?";
    }

    if (answer == "") {
        answer = "No answer!";
    }

    cell.setAttribute("onclick", "setQa(" + value + ",\""
            + escape(question) + "\",\""
            + escape(answer) + "\"); showQa(); markQa(this);");

    cell.innerHTML = "$" + value;

    return cell;
}

/**
 * Helper method that get the question value from a qa-container
 */
function getQaValue(qa) {
    return parseInt(qa.getElementsByTagName("input")[0].value);
}

/**
 * Marks the question as answered in the game table. The element
 * in the table is given by the currentGameTableCell variable
 */
function markQaAnswered() {
    // mark visually
    currentGameTableCell.className = currentGameTableCell.className ? " marked-q" : "marked-q";

    // make any future access show the question directly
    var onclick = currentGameTableCell.getAttribute("onclick");
    currentGameTableCell.setAttribute("onclick", onclick + " showAnswer();");
}

////////////////////////////////////////////////////////////////////////////////
// Code for entering and exiting game mode
////////////////////////////////////////////////////////////////////////////////

/**
 * Toggle between editor mode and game mode.
 */
function toggleEditorGame() {
    var editor = document.getElementById("editor");
    var game = document.getElementById("game-screen");

    if (game.style.display == "none") {
        editor.style.display = "none";
        game.style.display   = "block";
    } else {
        editor.style.display = "block";
        game.style.display   = "none";
    }
}

////////////////////////////////////////////////////////////////////////////////
// Code for manipulating the score list in game mode
////////////////////////////////////////////////////////////////////////////////

/**
 * Create a player container but do not add it to the DOM
 */
function createPlayerContainer(p, s) {
    // create the container element
    var cont = document.createElement("div");
    cont.setAttribute("class", "player");

    // player-name
    var name = document.createElement("div");
    name.setAttribute("class", "player-name");
    name.innerHTML = p;

    cont.appendChild(name);

    // player-score
    var score = document.createElement("div");
    score.setAttribute("class", "player-score");
    score.setAttribute("id", "player-" + p);
    score.innerHTML = "$" + s;

    cont.appendChild(score);

    // player-buttons
    var buttons = document.createElement("div");
    buttons.setAttribute("class", "player-buttons");

    cont.appendChild(buttons);

    // correct-button
    var correct = document.createElement("div");
    correct.setAttribute("class", "correct-button");
    correct.setAttribute("onclick", "increaseScore('" + p + "')");
    correct.innerHTML = "&#x2713;";

    buttons.appendChild(correct);

    // incorrect-button
    var incorrect = document.createElement("div");
    incorrect.setAttribute("class", "incorrect-button");
    incorrect.setAttribute("onclick", "decreaseScore('" + p + "')");
    incorrect.innerHTML = "&#x2717;";

    buttons.appendChild(incorrect);

    // return the container
    return cont;
}

/**
 * Updates the score list GUI from the players object
 */
function updateScoreList() {
    // get the scores element for convenience
    var scores = document.getElementById("scores");

    // create the new score table
    var scoresTable = document.createElement("div");

    // replace the old one
    scores.replaceChild(scoresTable, scores.firstElementChild);

    // add the scores
    for (player in players) {
        var score = createPlayerContainer(player, players[player]);

        scoresTable.appendChild(score);
    }
}

/**
 * Updates the score list GUI for the given player
 */
function updatePlayerScore(player) {
    // get the scores element for convenience
    var score = document.getElementById("player-" + player);

    // update the score
    score.innerHTML = "$" + players[player];
}

/**
 * Highlights the player's score in the given color
 */
function highlightPlayerScore(player, color) {
    // get the scores element for convenience
    var score = document.getElementById("player-" + player);

    // change color immediately
    score.style.transition = "0s";
    score.style.background = color;

    // fade out to normal color
    setTimeout(function(){
        score.style.transition = "2s";
        score.style.background = "";
    }, 1000);
}

////////////////////////////////////////////////////////////////////////////////
// Code to manipulate the setup screen
////////////////////////////////////////////////////////////////////////////////

/**
 * Reset the setup screen for the next use
 */
function resetSetup() {
    // get the elements
    var gameSetup = document.getElementById("game-setup");
    var playerList = document.getElementById("player-list");

    // create the new list element
    var newList = document.createElement("div");
    newList.setAttribute("id", "player-list");

    // replace the old one
    gameSetup.replaceChild(newList, playerList);

    // make setup visible
    gameSetup.style.display = "block";
}

////////////////////////////////////////////////////////////////////////////////
// Code to manipulate the single/multi player modes
////////////////////////////////////////////////////////////////////////////////

/**
 * Turns on single player mode
 */
function setSinglePlayerMode() {
    var answer = document.getElementById("game-answer-box");
    var check = document.getElementById("game-q-check");

    answer.className = answer.className.replace("single-player-hidden", "single-player-visible");
    check.className = check.className.replace("single-player-hidden", "single-player-visible");
}

/**
 * Turns on multi player mode
 */
function setMultiPlayerMode() {
    var answer = document.getElementById("game-answer-box");
    var check = document.getElementById("game-q-check");

    answer.className = answer.className.replace("single-player-visible", "single-player-hidden");
    check.className = check.className.replace("single-player-visible", "single-player-hidden");
}
