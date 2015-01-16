/**
 * This file contains code that manipulates the gui
 * for the editing gui.
 */

/**
 * Generates a new "+ New Category" button, but does not
 * add it to the DOM
 */
function createNewCatButton() {
    var newCatCont = document.createElement("div");
    newCatCont.setAttribute("class", "new-category-container");
    newCatCont.setAttribute("onclick", "newCategory(this); snapshot();");
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
    newQaCont.setAttribute("onclick", "newQa(this); snapshot();");
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
    input.setAttribute("onblur", "snapshot();");
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
    rmCat.setAttribute("onclick", "removeCategory(this.parentElement); snapshot();");
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
    rmQa.setAttribute("onclick", "removeQa(this); snapshot();");
    rmQa.innerHTML = "-";

    qaCont.appendChild(rmQa);

    // value
    var value = document.createElement("div");
    value.innerHTML = "$";

    var input = document.createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute("placeholder", "---");
    input.setAttribute("onblur", "snapshot();");
    input.value = amt;

    value.appendChild(input);

    qaCont.appendChild(value);

    // question
    var q = document.createElement("div");
    q.innerHTML = "Q";

    var qText = document.createElement("textarea");
    qText.setAttribute("onblur", "snapshot();");

    q.appendChild(qText);

    qaCont.appendChild(q);

    // answer
    var a = document.createElement("div");
    a.innerHTML = "A";

    var aText = document.createElement("textarea");
    aText.setAttribute("onblur", "snapshot();");

    a.appendChild(aText);

    qaCont.appendChild(a);

    return qaCont;
}
