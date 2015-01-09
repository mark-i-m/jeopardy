/*
 * This file contains all code that directly manipulates
 * the GUI or is called by the GUI.
 */

var gameName = "";

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
    document.getElementById("game-name").value = gameName;
}

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

function gameExit() {
    console.log("edit");

    // toggle editor mode
    toggleEditorGame();

    // remove the table
    var screen = document.getElementById("game-table");
    screen.removeChild(screen.firstElementChild);
}

// q and a should be escaped strings
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

function showQa() {
    document.getElementById("game-question-screen")
        .style.display = "block";
}

function closeQa() {
    document.getElementById("game-question-screen")
        .style.display = "none";
    document.getElementById("game-a")
        .style.display = "none";
    document.getElementById("game-q-answer")
        .style.display = "inline-block";
}

function markQa(ele) {
    ele.className = ele.className ? " marked-q" : "marked-q";
}

function showAnswer() {
    document.getElementById("game-a")
        .style.display = "block";
    document.getElementById("game-q-answer")
        .style.display = "none";
}

function save() {
    console.log("save");
}

function saveas() {
    console.log("saveas");
}

function load() {
    console.log("load");
}

function delet() {
    console.log("delete");
}

function undo() {
    console.log("undo");
}
