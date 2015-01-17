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
    if (currentQuestionValue < 0) {
        currentQuestionValue *= -1;
    }

    // change score value
    players[player] += currentQuestionValue;

    // update score list
    updatePlayerScore(player);

    // highlight the new score
    highlightScore(player);
}

/**
 * Decrease the given player's score by
 * currentQuestionValue and update the GUI
 */
function decreaseScore(player) {
    if (currentQuestionValue > 0) {
        currentQuestionValue *= -1;
    }

    // change score value
    players[player] += currentQuestionValue;

    // update score list
    updatePlayerScore(player);

    // highlight the new score
    highlightScore(player);
}

/**
 * Helper function that highlights the
 * score with the right color
 */
function highlightScore(player) {
    if (currentQuestionValue < 0) {
        highlightPlayerScore(player, "pink");
    } else if (currentQuestionValue > 0) {
        highlightPlayerScore(player, "lightgreen");
    } else {
        highlightPlayerScore(player, "orange");
    }
}
