/*
 * This file only contains functions NOT directly called
 * by the GUI.
 */

/**
 * Generates a new "+ New Category" button, but does not
 * add it to the DOM
 */
function createNewCatButton() {
    var newCatCont = document.createElement("div");
    newCatCont.setAttribute("class", "new-category-container");
    newCatCont.setAttribute("onclick", "newCategory(this);");
    newCatCont.innerHTML = "+ New Category";

    return newCatCont;
}

/**
 * Generates a new "+ New Question" button, but does not
 * add it to the DOM
 */
function createNewQaButton() {
    var newQaCont = document.createElement("div");
    newQaCont.setAttribute("class", "new-qa-container");
    newQaCont.setAttribute("onclick", "newQa(this);");
    newQaCont.innerHTML = "+ New Question";

    return newQaCont;
}

/**
 * Generates a new category container, but does not
 * add it to the DOM. The container is ready to be
 * rendered. It does not contain any questions. These
 * can be added by calling main.js:newQa.
 */
function createCatContainer() {
    // category-container
    var catCont = document.createElement("div");
    catCont.setAttribute("class", "category-container");

    // category-head expanded
    var catHead = document.createElement("div");
    catHead.setAttribute("class", "category-head expanded");

    var diamond = document.createElement("div");
    diamond.setAttribute("class", "category-head-diamond");
    diamond.setAttribute("onclick", "expandCategory(this.parentElement);");
    diamond.innerHTML = "&#9672";

    catHead.appendChild(diamond);

    // input
    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Category Name");
    input.value = "New Category";

    catHead.appendChild(input);

    // label
    var label = document.createElement("div");
    label.setAttribute("class", "category-label");
    label.setAttribute("onclick", "expandCategory(this.parentElement);");

    // add it after the rmCat element, so they render correctly
    // by putting it after the rmCat, css makes it take up the
    // remaining space in the catHead...

    // rm category button
    var rmCat = document.createElement("div");
    rmCat.setAttribute("class", "remove-category-container");
    rmCat.setAttribute("onclick", "removeCategory(this.parentElement);");
    rmCat.innerHTML = "-";

    catHead.appendChild(rmCat);
    catHead.appendChild(label);

    catCont.appendChild(catHead);

    // category-qas
    var catQas = document.createElement("div");
    catQas.setAttribute("class", "category-qas");

    // new-qa-container
    var newQaCont = createNewQaButton();

    catQas.appendChild(newQaCont);

    catCont.appendChild(catQas);

    return catCont;
}

/**
 * Creates a new empty qa-container, but does not
 * add it to the DOM. It is ready to be rendered
 * and used by the client.
 */
function createQaContainer(amt) {
    //qa-container
    var qaCont = document.createElement("div");
    qaCont.setAttribute("class", "qa-container");
    //qaCont.setAttribute("id", id);

    //remove-qa-container
    var rmQa = document.createElement("span");
    rmQa.setAttribute("class", "remove-qa-container");
    rmQa.setAttribute("onclick", "removeQa(this);");
    rmQa.innerHTML = "-";

    qaCont.appendChild(rmQa);

    // value
    var value = document.createElement("div");
    value.innerHTML = "$";

    var input = document.createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute("placeholder", "---");
    input.value = amt;

    value.appendChild(input);

    qaCont.appendChild(value);

    // question
    var q = document.createElement("div");
    q.innerHTML = "Q";
    q.appendChild(document.createElement("textarea"));

    qaCont.appendChild(q);

    // answer
    var a = document.createElement("div");
    a.innerHTML = "A";
    a.appendChild(document.createElement("textarea"));

    qaCont.appendChild(a);

    return qaCont;
}

function toggleEditorGame() {
    var editor = document.getElementById("editor");
    var game = document.getElementById("game-screen");

    if (game.style.display == "none") {
        editor.style.display = "none";
        game.style.display   = "block";
    } else {
        editor.style.display = "block";
        game.style.display   = "none";
    }
}

function createGameTable() {
    // create the table
    var table = document.createElement("table");

    var headerRow = document.createElement("tr");
    table.appendChild(headerRow);

    // get all categories
    var catContainers = document.getElementById("main-content")
                                .getElementsByClassName("category-container");

    // some bookkeeping variables: the dimensions of the table
    var rows = 0, cols = 0;

    for (var category = 0; category < catContainers.length; category++) {
        cols++;

        // add the header
        var header = createGameHeader(catContainers[category]);
        headerRow.appendChild(header);

        // get all questions
        var qaContainers = catContainers[category]
            .getElementsByClassName("category-qas")[0]
            .getElementsByClassName("qa-container");

        var currentRows = 0; // how many rows encountered in the current category

        for (var qa = 0; qa < qaContainers.length; qa++) {
            currentRows++;

            // if there are not enought rows, add more
            if (currentRows > rows) {
                rows++;

                table.appendChild(document.createElement("tr"));

                // fill in the "bald spots"
                for (var i = 0; i < cols-1; i++){
                    table.childNodes[currentRows].appendChild(document.createElement("td"));
                }
            }

            // create a new cell
            var cell = createGameCell(qaContainers[qa]);

            // add this question to the row
            table.childNodes[currentRows].appendChild(cell);
        }

        // fill in more "bald spots"
        for (var i = qaContainers.length + 1; i <= rows; i++) {
            table.childNodes[i].appendChild(document.createElement("td"));
        }
    }

    // return the table
    return table;
}

function createGameHeader(ele) {
    var head = document.createElement("th");
    head.innerHTML = ele.getElementsByClassName("category-head")[0]
                        .getElementsByTagName("input")[0]
                        .value;

    if (head.innerHTML == "") {
        head.innerHTML = "---";
    }

    return head;
}

function createGameCell(ele) {
    var cell = document.createElement("td");

    var value = ele.getElementsByTagName("input")[0].value;
    var question = ele.getElementsByTagName("textarea")[0].value;
    var answer = ele.getElementsByTagName("textarea")[1].value;

    if (value == "") {
        value = "---";
    }

    if (question == "") {
        question = "No question?";
    }

    if (answer == "") {
        answer = "No answer!";
    }

    cell.setAttribute("onclick", "setQa(" + value + ",\""
            + escape(question) + "\",\""
            + escape(answer) + "\"); showQa();");

    cell.innerHTML = "$" + value;

    return cell;
}
