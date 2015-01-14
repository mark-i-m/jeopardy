/*
 * This file contains code for saving, restoring, undoing, etc.
 */

/**
 * Removes the current main-content div and replaces it with
 * one generated from the given ast
 */
function restoreGame(ast) {
    // parameter validation
    if (ast.name !== "game") {
        throw "Error evaluating AST: not a <game> tag";
    }
    if (!(ast.attr.hasOwnProperty("name") &&
        ast.attr.hasOwnProperty("id"))) {
        throw "Error evaluating AST: <game> without id and/or name";
    }

    // new main-content div
    var newMainCont = document.createElement("div");
    newMainCont.setAttribute("id", "main-content");

    // restore the game name
    setGameName(unescape(ast.attr["name"]));
    gameId = parseInt(ast.attr["id"]);

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
    // validation
    if (ast.name !== "category") {
        throw "Error evaluating AST: not a <category> tag";
    }
    if (!ast.attr.hasOwnProperty("name")) {
        throw "Error evaluating AST: <category> without name";
    }

    // name of the category
    var name = ast.attr["name"];

    // new category-container div
    var newCatCont = createCatContainer();
    newCatCont.getElementsByTagName("input")[0].value = unescape(name);

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
    // validation
    if (ast.name !== "qa") {
        throw "Error evaluating AST: not a <qa> tag";
    }
    if (!(ast.attr.hasOwnProperty("q") &&
          ast.attr.hasOwnProperty("a") &&
          ast.attr.hasOwnProperty("value"))) {
        throw "Error evaluating AST: <qa> without q, a, and/or value";
    }

    // value, question, and answer
    var question = ast.attr["q"];
    var answer = ast.attr["a"];
    var value = ast.attr["value"];

    // new qa-container div
    var newQaCont = createQaContainer();

    newQaCont.getElementsByTagName("input")[0].value = unescape(value);
    newQaCont.getElementsByTagName("textarea")[0].value = unescape(question);
    newQaCont.getElementsByTagName("textarea")[1].value = unescape(answer);

    // return the container
    return newQaCont;
}

/**
 * Save xml to web storage
 */
function saveToWebStorage(xml) {
    // Check browser support for web storage
    if (typeof(Storage) != "undefined") {
        // Store
        localStorage.setItem("games", xml);
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}

/**
 * Find all games in web storage and return their
 * names, ids, and xml, along with the next unused id
 * in the form
 * {games: [{name: "name", id: #, game: <ast>}], nextId: #}
 */
function findAllGames() {
    var allGames = [];
    var nid = -1;

    // get the xml
    var xml = "<games>\n" +
              localStorage.getItem("games") +
              "</games>";
    var parsedXML = parseXML(lexXML(xml)).tree.children;

    // analyze each game
    for (var j = 0; j < parsedXML.length; j++) {
        // parameter validation
        if (parsedXML[j].name !== "game") {
            throw "Error evaluating AST: not a <game> tag";
        }
        if (!(parsedXML[j].attr.hasOwnProperty("name") &&
            parsedXML[j].attr.hasOwnProperty("id"))) {
            throw "Error evaluating AST: <game> without id and/or name";
        }

        var g = parsedXML[j];

        var n = g.attr["name"];
        var i = g.attr["id"];

        allGames.push({name: n, id: i, game: g});

        if (i > nid) {
            nid = i;
        }
    }

    return {games: allGames, nextId: ++nid};
}

function findGame(id) {
    var game = null;

    for (var i = 0; i < gamesList.length; i++) {
        if (gamesList[i].id == id) {
            game = gamesList[i];
            break;
        }
    }

    return game;
}
