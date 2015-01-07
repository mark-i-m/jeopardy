/**
 * Create an initial table setup with 1 row and column
 */
function initGame() {
    // create the first button
    var button1 = createNewCatButton(); // create a "new category" button
    document.getElementById("main-content").appendChild(button1);

    // use this button to create the first category
    var cat = newCategory(button1);
}

/**
 * Expand or collapse (toggles) the given category.
 * @param obj the html obj of the category-head element
 */
function expandCategory(obj) {
    // the little arrow after the category name
    var arrow = obj.childNodes[1].firstElementChild;

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

function newQa(ele) {
    // create elements
    var qaCont = createQaContainer();
    var button = createNewQaButton();

    // add them in the right places
    var catQas = ele.parentElement;
    catQas.insertBefore(button, ele);
    catQas.insertBefore(qaCont, ele);

    // return the qa-container
    return qaCont;
}

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
