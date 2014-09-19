/**
 * Render table
 *
 * @param table The table to render
 */
function rerender(table){
    var rows = table.getHeight();
    var cols = table.getWidth();

    /* update headers */
    var r0 = getRowId(table.getCol(1));
    updateRule(r0, rows, 0, 0);

    var c0 = getColId(table.getRow(1));
    updateRule(c0, cols, 0, 1);

    /* update rules for rows*/
    for (var r = 1; r <= rows; r++){
        var rid = getRowId(table.getRow(r));
        updateRule(rid,rows,r,0);
    }    

    /* update rules for cols*/
    for (var c = 1; c <= cols; c++){
        var cid = getColId(table.getCol(c));
        updateRule(cid,cols,c,1);
    }

    var theRules = new Array();
    var style = document.styleSheets[0];
    if (style.cssRules)
        theRules = style.cssRules;
    else
        theRules = style.rules;

    var rule = getCSSRule(".cell", theRules);

    if (rule == null){
        style.insertRule(".cell" + "{}", 0);
        if (style.cssRules)
            theRules = style.cssRules;
        else
            theRules = style.rules;
        rule = getCSSRule(".cell", theRules);
    }

    rule.style.width = 100/(cols + 1) + "%";
    rule.style.height = 100/(rows + 1) + "%";

}

/**
 * Updates rule id so that the width/height of its elements
 * are 100/num%.
 *
 * @param id The rule to update
 * @param num The number of rows/cols
 * @param pos The row/col number
 * @param rc 0 if id is a rule for rows; 1 if it is a rule for cols
 */
function updateRule(id, num, pos, rc){

    var theRules = new Array();
    var style = document.styleSheets[0];
    if (style.cssRules)
        theRules = style.cssRules;
    else if (style.rules)
        theRules = style.rules;
    else
        throw "Browser not supported";

    var rule = getCSSRule("." + id, theRules);

    if (rule == null){
        style.insertRule("." + id + "{}", 0);
        if (style.cssRules)
            theRules = style.cssRules;
        else
            theRules = style.rules;
        rule = getCSSRule("." + id, theRules);
    }

    switch(rc){
        case 0: //row
            rule.style.top = pos*100/(num + 1) + "%";
            break;
        case 1: //col
            rule.style.left = pos*100/(num + 1) + "%";
            break;
        default:
            throw "Invalid parameter to update rule " + rule + ". rc must be 0 or 1.";
    }
    
}

/**
* Gets the unique row id for this cell.
* The rid is a number preceded by 'r'
*
* @param the cell whose row id we want
*/
function getRowId(cell){
    var classes = cell.className;
    var regex = new RegExp('r\\d+',[]);
    var matches = regex.exec(classes);

    if(matches == null)
        throw "No row id found for " + cell;

    return matches[0];
}

/**
* Gets the unique col id for this cell
* the cid is a number preceded by 'c'
*
* @param the cell whose col id we want
*/
function getColId(cell){
    var classes = cell.className;
    var regex = new RegExp('c\\d+',[]);
    var matches = regex.exec(classes);
    
    if(matches == null)
        throw "No column id found for " + cell;

    return matches[0];
}

/**
* Creates a div representing a cell in the table.
* The cell is in the row with row id rid and column
* with column id cid. The cell is added as a child
* of container. 
*/
function createCell(rid, cid, container){
    var div = document.createElement("div");
    div.setAttribute("class", rid + " cell " + cid);
    container.appendChild(div);
    return div;
}

/**
* Creates add button for the given row or column; that is, a button that
* adds at the given position pos
* 
* @param pos the row/col pos
* @param container the buttons are added as a child to container
* @param rc 0 to add a row button; 1 to add a column button
*/
function createAddButton(pos, container, rc){
    
}

/**
* Creates delete button for the given or column; that is, a button that
* deletes the given position pos
* 
* @param pos the row/col pos
* @param container the buttons are added as a child to container
* @param rc 0 to add a row button; 1 to add a column button
*/
function createDeleteButton(pos, container, rc){

}

/**
* Creates left/right move button for the given column
* 
* @param pos the col pos
* @param container the buttons are added as a child to container
* @param lr 0 to add a left button; 1 to add a right button
*/
function createLeft/RightButton(pos, container, lr){

}

/**
* Creates up/down move button for the given row
* 
* @param pos the row pos
* @param container the buttons are added as a child to container
* @param tb 0 to add a top button; 1 to add a bottom button
*/
function createLeft/RightButton(pos, container, tb){

}

/**
* Returns the CSS rule object with the given selector
*
* @param id the selector
* @param rules the list of rules
*/
function getCSSRule(id, rules){
    for(var r = 0; r < rules.length; r++){
        if(rules[r].selectorText == id)
            return rules[r];
    }
    return null;
}
