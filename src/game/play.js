/**
 * This file contains code for manipulating game play
 */

var players = {};

// value of the current question
var currentQuestionValue = 0;

function increaseScore(player) {
    // change score value
    players[player] += currentQuestionValue;

    // update score list
    updateScoreList();
}

function decreaseScore(player) {
    // change score value
    players[player] -= currentQuestionValue;

    // update score list
    updateScoreList();
}
