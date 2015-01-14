/**
 * This file contains code for undoing and redoing
 * changes to the game
 */

var gameHistory = [];
var historyIndex = 0;

// <0 -> more recent
// >0 -> older
function historyMove(delta) {
    // make sure there is more history to undo or redo
    if (historyIndex + delta < 0 ||
        historyIndex + delta >= gameHistory.length) {
        return;
    }

    // increase history index
    historyIndex += delta;

    // reload the game
    restoreGame(gameHistory[historyIndex]);
}

function historyUpdate(ast) {
    // if the game has been undone,
    // we can now throw away the more
    // recent history
    gameHistory = gameHistory.slice(historyIndex);
    historyIndex = 0;

    // add the new history at the beginning
    var len = gameHistory.unshift(ast);

    // trim the history if it is too long
    if (len > 20) {
        gameHistory = gameHistory.slice(0,20);
    }
}

function historyClear() {
    gameHistory = [];
}
