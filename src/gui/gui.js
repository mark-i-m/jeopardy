/**
 * Create html elements for category c of Table t.
 *
 * Each table cell contains a JeopardyCell,
 * which associates an html dom element and
 * an id. This function assumes the JeopardyCell
 * already exists.
 */
function createCategory(t, c) {
    // go to the right place in the table
    t.setCursor(0,c);

    // create the category elements
    var catContainer = createCatContainer(t.get().id);

    // associate them with the category in the table
    t.get().ele = catContainer;

    // for each row in category c
    var height = t.getHeight();
    for(var i = 0; i < height; i++) {
        // go to the row
        t.down();

        // generate its elements
        var row = createQaContainer(t.get().id);

        // associate them with the cells in the table
        t.get().ele = row;

        // add to the category element
        catContainer.addChild(row);

        // create the corresponding "new quesiton" button
        var button = createNewQaButton();
        catContainer.addChild(button);
    }

    // return the category
    return catContainer;
}

function createNewCatButton
function createNewQaButton

function createCatContainer
function createQaContainer
