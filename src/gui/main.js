/*
 * This file contains all code that directly manipulates
 * the GUI or is called by the GUI.
 */

var gamesList = [];

var gameName = "";
var gameId = 0;

var nextId = 0;

/**
 * Create an initial table setup with 1 row and column
 */
function initGame() {
    // create the first button
    var button1 = createNewCatButton(); // create a "new category" button
    document.getElementById("main-content").appendChild(button1);

    // use this button to create the first category
    var cat = newCategory(button1);

    // set the new game name
    setGameName("New Game");

    // load games and set nextId
    var games = findAllGames();

    // set the new game id
    nextId = games.nextId;
    gamesList = games.games;

    gameId = nextId++;

    populateGameList(gamesList);

    // take a snapshot
    snapshot();
}

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
}

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
    document.getElementById("game-question-screen")
        .style.display = "none";
    document.getElementById("game-a")
        .style.display = "none";
    document.getElementById("game-q-answer")
        .style.display = "inline-block";
}

/**
 * Mark the selected question as marked on the
 * game table in game mode
 */
function markQa(ele) {
    ele.className = ele.className ? " marked-q" : "marked-q";
}

/**
 * Show the answer of the question on the question
 * screen in game mode
 */
function showAnswer() {
    document.getElementById("game-a")
        .style.display = "block";
    document.getElementById("game-q-answer")
        .style.display = "none";
}

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

    updateGamesList();
}

function saveas() {
    console.log("saveas");

    // get the new Id
    gameId = nextId++;

    // save the new game
    save();
}

function delet() {
    console.log("delete");

    // find the object
    var gameObj = findGame(gameId);

    if (gameObj === null) {
        return;
    }

    var index = gamesList.indexOf(gameObj);

    // remove it
    gamesList.splice(index, 1);

    // update the gui
    updateGamesList();
}

function undo() {
    console.log("undo");

    historyMove(1);
}

function redo() {
    console.log("redo");

    historyMove(-1);
}

function snapshot() {
    console.log("snapshot");

    // generate ast
    var ast = generateGameAST();

    // save it in history
    historyUpdate(ast);
}
