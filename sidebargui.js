/**
 * This file contains code that manipulates the gui for
 * the sidebar in editor mode.
 */

/**
 * Populates the games list element of the GUI with
 * games.
 */
function populateGameList(games) {
    // create a new game-list
    var list = document.createElement("span");
    list.setAttribute("id", "game-list");
    list.setAttribute("style", "display:block;");

    document.getElementById("side-bar").replaceChild(list,
            document.getElementById("game-list"));

    // add games
    for (var i = 0; i < games.length; i++) {
        var name = games[i].name;
        var id = parseInt(games[i].id);

        var option = document.createElement("div");
        option.setAttribute("onclick", "loadGame(" + id + ");");
        option.setAttribute("id", "game-list-" + id);
        option.innerHTML = unescape(name);

        if (id === gameId) {
            option.setAttribute("class", "selected");
        } else {
            option.setAttribute("class", "");
        }

        list.appendChild(option);
    }
}

function updateGamesList() {
    // write the xml to webstorage
    var xml = generateAllGameXML();

    saveToWebStorage(xml);
    populateGameList(gamesList);
}

// disable and enable the buttons for more aesthetics
function updateUndoButtons() {
    var undo = document.getElementById("undo");
    var redo = document.getElementById("redo");

    // if no undo history, disable undo button
    if (historyIndex >= gameHistory.length-1) {
        undo.className = undo.className.replace("enabled", "disabled");
    } else {
        undo.className = undo.className.replace("disabled", "enabled");
    }

    // if no redo history, disable redo button
    if (historyIndex == 0) {
        redo.className = redo.className.replace("enabled", "disabled");
    } else {
        redo.className = redo.className.replace("disabled", "enabled");
    }
}

// disable and enable the delete button for aesthetics
function disableDeleteButton() {
    var del = document.getElementById("delete");
    del.className = del.className.replace("enabled", "disabled");
}

function enableDeleteButton() {
    var del = document.getElementById("delete");
    del.className = del.className.replace("disabled", "enabled");
}

function confirmLeaveGame() {
    try {
        if (!saved) {
            if (confirm("The game you are leaving has unsaved changes. Would you like to save now? If you do not, the changes will be lost!\n\nClick OK to save, or Cancel to proceed without saving.")) {
                save();
            } else {
                console.log("User has chosen not to save changes.");
            }
        }
    } catch (e) {
        console.log("User has blocked confirmation messages. Proceeding to new game without the opportunity to save!");
    }
}
