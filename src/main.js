/*
 * This file contains all code that is directly called by the GUI.
 */

////////////////////////////////////////////////////////////////////////////////
// Code to initialize the gui
////////////////////////////////////////////////////////////////////////////////

/**
 * Create an initial table setup with 1 row and column
 */
function initGame() {
    // load games and set nextId
    var games = findAllGames();

    // set the new game id
    nextId = games.nextId;
    gamesList = games.games;

    // to prevent "unsaved changes" messages
    saved = true;

    newGame();
}

////////////////////////////////////////////////////////////////////////////////
// Code to customize the game
////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a new category and adds it to the DOM in the appropriate
 * location. The new category is immediately visible to the user. The
 * new category is returned to the caller for convenience.
 */
function newCategory(ele) {
    // create elements
    var cat = createCatContainer(); // create category
    var button2 = createNewCatButton(); // create a "new category" button

    // add them in the right places
    var mainCont = document.getElementById("main-content");
    mainCont.insertBefore(button2, ele);
    mainCont.insertBefore(cat, ele);

    // create a new question for the category
    newQa(cat.childNodes[1].childNodes[0]);

    // return the category
    return cat;
}

/**
 * Removes the given category from the DOM and returns it.
 * After this, the category is no longer visible to the user.
 */
function removeCategory(ele) {
    // locate the element and its corresponding button
    var cat = ele.parentElement;
    var button = cat.nextElementSibling;

    // remove the elements
    var mainCont = cat.parentElement;
    mainCont.removeChild(cat);
    mainCont.removeChild(button);

    // return the removed element
    return cat;
}

/**
 * Creates a new question and adds it to the DOM in the appropriate
 * location. The new question is immediately visible to the user. The
 * new question is returned to the caller for convenience.
 */
function newQa(ele) {
    // create elements
    var qaCont = createQaContainer(0);
    var button = createNewQaButton();

    // add them in the right places
    var catQas = ele.parentElement;
    catQas.insertBefore(button, ele);
    catQas.insertBefore(qaCont, ele);

    // return the qa-container
    return qaCont;
}

/**
 * Removes the given question from the DOM and returns it.
 * After this, the question is no longer visible to the user.
 */
function removeQa(ele) {
    // locate the element
    var qaCont = ele.parentElement;
    var button = qaCont.nextElementSibling;

    // remove from parent
    var catQas = qaCont.parentElement;
    catQas.removeChild(qaCont);
    catQas.removeChild(button);

    // return the removed element
    return qaCont;
}

/**
 * Convenience function to set the game name and update that
 * part of the gui
 */
function setGameName(name) {
    gameName = name;
    document.title = "Jeopardy - " + name;
    document.getElementById("game-name").value = gameName;
}

////////////////////////////////////////////////////////////////////////////////
// Misc code for the editor the gui
////////////////////////////////////////////////////////////////////////////////

/**
 * Expand or collapse (toggles) the given category.
 * @param obj the html obj of the category-head element
 */
function expandCategory(obj) {
    // the little arrow before the category name
    var arrow = obj.getElementsByClassName("category-head-diamond")[0];

    // category-qas element
    var qas = obj.nextElementSibling.style;

    // whether the block is expanded or not
    var isExpanded = qas.display != "none";
    if(isExpanded) {
        qas.display = "none";
        arrow.innerHTML = "&#9671;";
        obj.className = obj.className.replace("expanded", "collapsed");
    } else {
        qas.display = "block";
        arrow.innerHTML = "&#9672;";
        obj.className = obj.className.replace("collapsed","expanded");
    }
}

/**
 * Take a snapshot of the current state of the game.
 * Each snapshot goes to the front of the undo history.
 */
function snapshot() {
    console.log("snapshot");

    // generate ast
    var ast = generateGameAST();

    // save it in history
    historyUpdate(ast);

    // this game now has unsaved changes
    saved = false;
}

////////////////////////////////////////////////////////////////////////////////
// Code CALLED by the sidebar buttons
////////////////////////////////////////////////////////////////////////////////

/**
 * Switches to game mode. This function generates a game table
 * element, adds it to the DOM, and makes it visible to the
 * user.
 */
function play() {
    console.log("play");

    // toggle game mode
    toggleEditorGame();

    // create a game table
    var table = createGameTable();

    // replace with the new table
    var screen = document.getElementById("game-table");
    screen.appendChild(table);
}

/**
 * Undo once
 */
function undo() {
    console.log("undo");

    historyMove(1);

    // this game now has unsaved changes
    saved = false;
}

/**
 * Redo once
 */
function redo() {
    console.log("redo");

    historyMove(-1);

    // this game now has unsaved changes
    saved = false;
}

/**
 * Save the current state of the game
 */
function save() {
    console.log("save");

    // save the ast in the game object
    var gameObj = findGame(gameId);
    var ast = generateGameAST();

    // if the game is not already saved, do so
    if (gameObj === null) {
        gamesList.push({name: gameName, id: gameId, game: ast});
    } else { // otherwise, just save the new AST
        gameObj.game = ast;
        gameObj.name = gameName;
    }

    saved = true;

    updateGamesList();

    // enable the delete button
    enableDeleteButton();
}

/**
 * Save this game as a different game.
 * For new games, this has the same effect as
 * just pressing save.
 */
function saveas() {
    console.log("saveas");

    // get the new Id
    gameId = nextId++;

    // save the new game
    save();
}

/**
 * Restores the game with the given id
 */
function loadGame(id) {
    // make sure the game is not already loaded
    if (gameId == id) {
        return;
    }

    // Ask the user to continue or wait and save the
    // current game
    confirmLeaveGame();

    // find the game
    var game = findGame(id);

    if (game === null) {
        throw "Game " + id + " not found";
    }

    // mark the game in the game list
    if (findGame(gameId) !== null) {
        var old = document.getElementById("game-list-" + gameId);
        old.className = old.className.replace(/selected/g, "");
    }

    var newGame = document.getElementById("game-list-" + id);
    newGame.className += " selected";

    // restore the game
    restoreGame(game.game);

    // clear the history and take the initial snapshot
    historyClear();
    snapshot();

    // the game has no changes yet
    saved = true;

    // enable the delete button
    enableDeleteButton();
}

/**
 * Create and draw a new game to the editor
 */
function newGame() {
    // Ask the user to continue or wait and save the
    // current game
    confirmLeaveGame();

    console.log("new game");

    // remove the main-content
    // and create a new one
    var newMainCont = document.createElement("div");
    newMainCont.setAttribute("id", "main-content");

    document.getElementById("editor").replaceChild(
            newMainCont,
            document.getElementById("main-content"));

    // create the first button
    var button1 = createNewCatButton(); // create a "new category" button
    document.getElementById("main-content").appendChild(button1);

    // use this button to create the first category
    var cat = newCategory(button1);

    // set the new game name
    setGameName("New Game");
    gameId = nextId++;

    // repopulate the list to fix highlighting
    populateGameList(gamesList);

    // clear history and take a first snapshot
    historyClear();
    snapshot();

    // game has never been saved
    saved = false;

    // disable the delete button
    disableDeleteButton();
}

/**
 * Delete the currently loaded game from the
 * web storage.
 */
function delet() {
    // find the object
    var gameObj = findGame(gameId);

    if (gameObj === null) {
        return;
    }

    // confirm with the user
    // if the user asked not to be notified again, simply proceed
    try {
        if (!confirm("Delete the currently loaded game? This action CANNOT be undone.\n\nClick OK to delete the game.")) {
            return;
        }
    } catch (e) {
        console.log("Delete game confirmation was blocked. Proceeding to delete!");
    }

    console.log("delete");

    var index = gamesList.indexOf(gameObj);

    // remove it
    gamesList.splice(index, 1);

    // update the gui
    updateGamesList();

    // disable the delete button
    disableDeleteButton();
}

////////////////////////////////////////////////////////////////////////////////
// Code to enter and exit game mode
////////////////////////////////////////////////////////////////////////////////

/**
 * Called from the setup screen to actually start playing
 */
function startGame () {
    // check the number of players
    if (numPlayers < 1) {
        alert("There must be at least one player");
        return;
    } else if (numPlayers == 1) {
        // single player mode
        setSinglePlayerMode();
    } else {
        // otherwise multi-player mode
        setMultiPlayerMode();
    }

    // update the score list
    updateScoreList();

    // hide the setup screen
    document.getElementById("game-setup").style.display = "none";
}

/**
 * Switch to editor mode. This function removes the game table
 * from the DOM. And makes the editor visible again.
 */
function gameExit() {
    console.log("edit");

    // toggle editor mode
    toggleEditorGame();

    // remove the table
    var screen = document.getElementById("game-table");
    screen.removeChild(screen.firstElementChild);

    // close question string, just in case
    closeQa();

    // reset the scores
    players = {};
    numPlayers = 0;
    updateScoreList();

    // reset the setup screen
    resetSetup();
}

////////////////////////////////////////////////////////////////////////////////
// Code for the setup screen gui
////////////////////////////////////////////////////////////////////////////////

// game setup in game mode
function addPlayer (name) {
    // validate player input
    if (name === "" || name === undefined) {
        alert("Player name cannot be empty");
        return;
    }
    if (players.hasOwnProperty(name)) {
        alert("This player already exists");
        return;
    }

    // display the player
    document.getElementById("player-list").innerHTML +=
        "<span>" + name + "</span>";

    // players start with score 0
    players[name] = 0;

    // player count
    numPlayers++;
}

////////////////////////////////////////////////////////////////////////////////
// Code for the question screen gui
////////////////////////////////////////////////////////////////////////////////

/**
 * Show the question screen of in game mode
 */
function showQa() {
    document.getElementById("game-question-screen")
        .style.display = "block";
}

/**
 * Hide and reset the question screen in game mode
 */
function closeQa() {
    // hide the screen
    document.getElementById("game-question-screen")
        .style.display = "none";

    // hide the answer
    document.getElementById("game-a")
        .style.display = "none";
    document.getElementById("game-user-a")
        .style.display = "none";
    document.getElementById("game-user-a")
        .innerHTML = "";
    document.getElementById("game-q-answer")
        .style.display = "inline-block";

    // display the answer box
    document.getElementById("game-q-check")
        .style.display = "inline-block";
    document.getElementById("game-answer-box")
        .value = "";

    currentQuestionValue = 0;
}

/**
 * Show the answer of the question on the question
 * screen in game mode
 */
function showAnswer() {
    // show the correct answer
    document.getElementById("game-a")
        .style.display = "block";

    // show the user answer
    document.getElementById("game-user-a")
        .style.display = "block";
    document.getElementById("game-answer-box")
        .style.display = "none";

    // hide the buttons
    document.getElementById("game-q-answer")
        .style.display = "none";
    document.getElementById("game-q-check")
        .style.display = "none";

    // mark the question as answered
    markQaAnswered();
}

/**
 * Check the answer entered into the answer box
 */
function checkAnswer() {
    // get the user's answer
    var answerBox = document.getElementById("game-answer-box");
    var answer = answerBox.value;

    // get the correct answer
    var correct = document.getElementById("game-a").innerHTML;

    // compare them
    if (answer === correct) {
        // increase the player's score
        // this is a bit hacky, but it works
        // since this is only for single-player mode
        for (p in players) {
            increaseScore(p);
        }
    } else {
        // otherwise decrement
        for (p in players) {
            decreaseScore(p);
        }
    }

    document.getElementById("game-user-a")
        .innerHTML = "You answered: " + answer;

    // show the answer, also
    showAnswer();
}

/**
 * Sets the question, answer, and value strings of the
 * question screen in game mode.
 *
 * The question and answer strings should be escaped,
 * since this allows more freedom to the user.
 */
function setQa(value, question, answer) {
    question = unescape(question);
    answer = unescape(answer);

    document.getElementById("game-q-label").innerHTML =
        "$" + value;

    document.getElementById("game-q").innerHTML =
        question;

    document.getElementById("game-a").innerHTML =
        answer;

    currentQuestionValue = value;
}

/**
 * Mark the selected question as marked on the
 * game table in game mode
 */
function markQa(ele) {
    // store this element so that we can mark the question
    // as answer when the appropriate button is clicked
    currentGameTableCell = ele;
}
