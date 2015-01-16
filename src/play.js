/**
 * This file contains code for manipulating game play
 */

// The list of players in this game
var players = {};
var numPlayers = 0;

// value of the current question
var currentQuestionValue = 0;

/**
 * Increase the given player's score by
 * currentQuestionValue and update the GUI
 */
function increaseScore(player) {
    // change score value
    players[player] += currentQuestionValue;

    // update score list
    updatePlayerScore(player);

    // highlight the new score
    highlightPlayerScore(player, "lightgreen");
}

/**
 * Decrease the given player's score by
 * currentQuestionValue and update the GUI
 */
function decreaseScore(player) {
    // change score value
    players[player] -= currentQuestionValue;

    // update score list
    updatePlayerScore(player);

    // highlight the new score
    highlightPlayerScore(player, "pink");
}
