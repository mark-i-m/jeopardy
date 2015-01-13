/*
 * This file contains code for saving, restoring, undoing, etc.
 */

/**
 * Removes the current main-content div and replaces it with
 * one generated from the given ast
 */
function restoreGame(ast) {
    // new main-content div
    var newMainCont = document.createElement("div");
    newMainCont.setAttribute("id", "main-content");

    // restore the game name
    setGameName(unescape(ast.attr[0].value));

    // create the first button
    newMainCont.appendChild(createNewCatButton());

    // add all categories
    for (var i = 0; i < ast.children.length; i++) {
        newMainCont.appendChild(restoreCategory(ast.children[i]));
        newMainCont.appendChild(createNewCatButton());
    }

    // Replace main-content
    document.getElementById("editor").replaceChild(
            newMainCont,
            document.getElementById("main-content"));
}

/**
 * Creates a category-container div from the ast but does
 * not add it to the DOM.
 */
function restoreCategory(ast) {
    // name of the category
    var name = ast.attr[0].value;

    // new category-container div
    var newCatCont = createCatContainer();
    newCatCont.getElementsByTagName("input")[0].input = name;

    // add all questions
    var catQas = newCatCont.getElementsByClassName("category-qas")[0];
    for (var i = 0; i < ast.children.length; i++) {
        catQas.appendChild(restoreQa(ast.children[i]));
        catQas.appendChild(createNewQaButton());
    }

    // return the container
    return newCatCont;
}

/**
 * Creates a qa-container div from the ast but does not
 * add it to the DOM.
 */
function restoreQa(ast) {
    // value, question, and answer
    var value = ast.attr[0].value;
    var question = ast.attr[0].value;
    var answer = ast.attr[0].value;

    // new qa-container div
    var newQaCont = createQaContainer();

    newQaCont.getElementsByClassName("input")[0].value = value;
    newQaCont.getElementsByTagName("textarea")[0].value = question;
    newQaCont.getElementsByTagName("textarea")[1].value = answer;

    // return the container
    return newQaCont;
}
