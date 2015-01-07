/**
 * Create html elements for category c of Table t.
 *
 * Each table cell contains a JeopardyCell,
 * which associates an html dom element and
 * an id. This function assumes the JeopardyCell
 * already exists.
 */
//function createCategory(t, c) {
//    // go to the right place in the table
//    //t.setCursor(0,c);
//
//    // create the category elements
//    var catContainer = createCatContainer(t.get().id);
//
//    // associate them with the category in the table
//    t.get().ele = catContainer;
//
//    // for each row in category c
//    var height = t.getHeight();
//    for(var i = 0; i < height; i++) {
//        // go to the row
//        t.down();
//
//        // generate its elements
//        var row = createQaContainer(t.get().id);
//
//        // associate them with the cells in the table
//        t.get().ele = row;
//
//        // add to the category element
//        catContainer.childNodes[1].appendChild(row);
//
//        // create the corresponding "new quesiton" button
//        var button = createNewQaButton();
//        catContainer.appendChild(button);
//    }
//
//    // return the category
//    return catContainer;
//}

function createNewCatButton() {
    var newCatCont = document.createElement("div");
    newCatCont.setAttribute("class", "new-category-container");
    newCatCont.setAttribute("onclick", "newCategory(this);");
    newCatCont.innerHTML = "+ New Category";

    return newCatCont;
}

function createNewQaButton() {
    var newQaCont = document.createElement("div");
    newQaCont.setAttribute("class", "new-qa-container");
    newQaCont.setAttribute("onclick", "newQa(this);");
    newQaCont.innerHTML = "+ New Question";

    return newQaCont;
}

function createCatContainer(/*id*/) {
    // category-container
    var catCont = document.createElement("div");
    catCont.setAttribute("class", "category-container");
    //catCont.setAttribute("id", id);

    // category-head expanded
    var catHead = document.createElement("div");
    catHead.setAttribute("class", "category-head expanded");

    // label
    var label = document.createElement("div");
    label.setAttribute("class", "category-label");
    label.setAttribute("onclick", "expandCategory(this.parentElement);");
    label.innerHTML = "New Category ";

    var diamond = document.createElement("span");
    diamond.innerHTML = "&#9672";

    label.appendChild(diamond);
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

function createQaContainer(/*id*/) {
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

    // question
    var q = document.createElement("div");
    q.innerHTML = "Q<br />";
    q.appendChild(document.createElement("textarea"));

    qaCont.appendChild(q);

    // answer
    var a = document.createElement("div");
    a.innerHTML = "A<br />";
    a.appendChild(document.createElement("textarea"));

    qaCont.appendChild(a);

    return qaCont;
}
