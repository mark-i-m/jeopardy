/*
 * The current state of the game table
 * Each cell contains a JeopardyCell object, which associates
 * an html element with a cell/row/col id.
 */
var table;

/**
 * Create an initial table setup with 1 row and column
 */
function initGame() {
    table = new Table(1,1);

    var button1 = createNewCatButton(); // create a "new category" button
    document.getElementById("main-content").addChild(button1);

    var cat = createCategory(table, 1); // create category 1 of table
    document.getElementById("main-content").addChild(cat);

    var button2 = createNewCatButton(); // create a "new category" button
    document.getElementById("main-content").addChild(button2);
}

/**
 * Expand or collapse (toggles) the given category.
 * @param obj the html obj of the category-head element
 */
function expandCategory(obj) {
    // the little arrow after the category name
    var arrow = obj.firstElementChild;

    // all qa-containers
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

function newCategory(ele) {

}

function removeCategory(ele) {

}

function newQa(ele) {

}

function removeQa(ele) {

}
