/**
 *
 * @author Mark Mansi
 *
 * A table represented by a graph internally.
 *
 */
function Table (r, c) {

    /**
     * A cell in the table with this content.
     * Pass null for empty Cell
     */
    var Cell = function (cont) {

        var content;//content of this cell; must be comparable
        var right;//pointer to cell to the right
        var down;//pointer to cell below

        /**
         * Set the pointer to the cell below
         *
         * @param down the cell below
         */
        this.setDown = function(d) {
            down = d;
        }

        /**
         * Set the pointer to the cell right
         *
         * @param right the cell to the right
         */
        this.setRight = function(r) {
            right = r;
        }

        /**
         * Set the cell's content
         *
         * @param content the content
         */
        this.setContent = function(c) {
            content = c;
        }

        /**
         * @return the cell below
         */
        this.getDown = function() {
            return down;
        }

        /**
         * @return the cell to the right
         */
        this.getRight = function() {
            return right;
        }

        /**
         * @return the cell's content
         */
        this.getContent = function() {
            return content;
        }

        /**
         * Create a cell and make content its content
         *
         * @param content the new content
         */
        content = cont;
        right = null;
        down = null;
    }

    //number of rows and cols, respectively (not including header)
    var rows = 0;
    var cols = 0;

    //both of type Cell
    var cursor;//the cursor on the table
    var first;//the top left corner fo teh table; in the row-col spot
    /*

       XX is first

       XX|b ...
       -----
       a |c
       .    .
       .      .
       .        .

     */

    /**
     * @return the number of columns
     */
    this.getWidth = function() {
        return cols;
    }

    /**
     * @return the number of rows
     */
    this.getHeight = function() {
        return rows;
    }

    /**
     * Creates a new row.
     *
     * The new row becomes the pos-th row in the table. Indexing of the table
     * starts with 0 as the row/column headers and 1 being the first cell.
     *
     * If there are no arguments, the new row becomes the last row of the Table
     *
     * @param pos the position of the new row
     */
    this.newRow = function(pos) {

        if(arguments.length == 0)
            pos = rows + 1;

        if (pos > rows + 1) {
            throw "This row number is too large. Max row number allowed: " + (rows + 1);
        }

        if (pos < 1) {
            throw "This row number is too small. Min row number allowed: 1";
        }

        var row1;

        if (pos == 1) {
            row1 = first;
        } else {
            row1 = getRowHead(pos - 1);
        }

        var row2 = row1.getDown();
        var row = new Cell();

        for (var c = 0; c <= cols; c++) {

            row1.setDown(row);
            row.setDown(row2);

            if (c < cols) {
                var newCell = new Cell();
                row.setRight(newCell);
                row = newCell;
            }

            row1 = row1.getRight();

            if (row2 != null) {
                row2 = row2.getRight();
            }

        }

        rows++;

    }

    /**
     * Creates a new column
     *
     * The new column becomes the pos-th column in the table
     * If there are no arguments, the new column becomes the last
     * in the table.
     *
     * @param pos the position of the new column
     */
    this.newCol = function(pos) {

        if(arguments.length == 0)
            pos = cols + 1;

        if (pos > cols + 1) {
            throw "This column number is too large. Max column number allowed: " + (cols + 1);
        }

        if (pos < 1) {
            throw "This column number is too small. Min column number allowed: 1";
        }

        var col1;
        if (pos == 1) {
            col1 = first;
        } else {
            col1 = getColHead(pos - 1);
        }

        var col2 = col1.getRight();
        var col = new Cell();

        for (var r = 0; r <= rows; r++) {

            col1.setRight(col);
            col.setRight(col2);

            if (r < rows) {
                var newCell = new Cell();
                col.setDown(newCell);
                col = newCell;
            }

            col1 = col1.getDown();

            if (col2 != null) {
                col2 = col2.getDown();
            }

        }

        cols++;

    }

    /**
     * Moves the row at position pos to position to. The row at position to goes
     * to position (to + 1) if pos > to, or (to - 1) if pos < to
     *
     * @param pos the row number of the row to move
     * @param to the new position of the row to move
     */
    this.moveRow = function(pos, to) {

        if (pos > rows || to > rows) {
            throw "This row number is too large. Max row number allowed: " + rows;
        }

        if (pos < 1 || to < 1) {
            throw "This row number is too small. Min row number allowed: 1";
        }

        if (to == pos) {
            return;
        }

        var row = getRowHead(pos);

        this.deleteRow(pos);

        var row1;
        if (to == 1) {
            row1 = first;
        } else {
            row1 = getRowHead(to - 1);
        }

        var row2 = row1.getDown();

        for (var c = 0; c <= cols; c++) {

            row1.setDown(row);
            row.setDown(row2);

            row1 = row1.getRight();
            row = row.getRight();

            if (row2 != null) {
                row2 = row2.getRight();
            }

        }

        rows++;//compensate for delete

    }

    /**
     * Moves the column at position pos to position to. The column at position
     * to goes to position (to + 1) if pos > to, or (to - 1) if pos < to
     *
     * @param pos the column number of the column to move
     * @param to the new position of the column to move
     */
    this.moveCol = function(pos, to) {

        if (pos > cols) {
            throw "This column number is too large. Max column number allowed: " + cols;
        }

        if (pos < 1) {
            throw "This column number is too small. Min column number allowed: 1";
        }

        if (to == pos) {
            return;
        }

        var col = getColHead(pos);

        this.deleteCol(pos);

        var col1;
        if (to == 1) {
            col1 = first;
        } else {
            col1 = getColHead(to - 1);
        }

        var col2 = col1.getRight();

        for (var r = 0; r <= rows; r++) {

            col1.setRight(col);
            col.setRight(col2);

            col1 = col1.getDown();
            col = col.getDown();

            if (col2 != null) {
                col2 = col2.getDown();
            }

        }

        cols++;// compensate for delete

    }

    /**
     * Deletes the row at position pos
     * If there are no arguments, the last row is removed
     *
     * @param pos the position of the row to delete
     */
    this.deleteRow = function(pos) {

        if(arguments.length == 0)
            pos = rows;

        if (pos > rows) {
            throw "This row number is too large. Max row number allowed: " + rows;
        }

        if (pos < 1) {
            throw "This row number is too small. Min row number allowed: 1";
        }

        var row1;
        if (pos == 1) {
            row1 = first;
        } else {
            row1 = getRowHead(pos - 1);
        }

        var row2 = row1.getDown();

        for (var c = 0; c <= cols; c++) {

            row1.setDown(row2.getDown());

            row1 = row1.getRight();
            row2 = row2.getRight();

        }

        rows--;

    }

    /**
     * Deletes the column at position pos
     *
     * If
     *
     * @param pos the position of the column to delete
     */
    this.deleteCol = function(pos) {

        if(arguments.length == 0)
            pos = cols;

        if (pos > cols) {
            throw "This column number is too large. Max column number allowed: " + cols;
        }

        if (pos < 1) {
            throw "This column number is too small. Min column number allowed: 1";
        }

        var col1;
        if (pos == 1) {
            col1 = first;
        } else {
            col1 = getColHead(pos - 1);
        }

        var col2 = col1.getRight();

        for (var r = 0; r <= rows; r++) {

            col1.setRight(col2.getRight());

            col1 = col1.getDown();
            col2 = col2.getDown();

        }

        cols--;

    }

    /**
     * Get the row header of the row at position pos
     *
     * @param pos row number
     * @return row header contents
     */
    this.getRow = function(pos) {
        return getRowHead(pos).getContent();
    }

    /**
     * Get the column header of the column at position pos
     *
     * @param pos column number
     * @return column header contents
     */
    this.getCol = function(pos) {
        return getColHead(pos).getContent();
    }

    /**
     * Get the cell at (row, col)
     *
     * @param row the row number
     * @param col the column number
     * @return the cell's contents
     */
    this.getCell = function(row, col) {
        return getCellObj(row, col).getContent();
    }

    this.setRow = function(pos, content) {
        getRowHead(pos).setContent(content);
    }

    this.setCol = function(pos, content) {
        getColHead(pos).setContent(content);
    }

    this.setCell = function(row, col, content) {
        getCellObj(row, col).setContent(content);
    }

    /**
     * Sets the contents of the cell at the cursor
     */
    this.set = function(contents) {
        cursor.setContent(contents);
    }

    /**
     * Gets the contents of the cell at the cursor
     *
     * @return the cell's contents
     */
    this.get = function() {
        if (cursor == first) {
            throw "The cursor must first be set.";
        }

        return cursor.getContent();
    }

    /**
     * @return T if there is another cell to the right of the cell the cursor is
     * currently on; F otherwise
     */
    this.hasRight = function() {
        return cursor.getRight() != null;
    }

    /**
     * @return T if there is another cell below the cell the cursor is currently
     * on; F otherwise
     */
    this.hasDown = function() {
        return cursor.getDown() != null;
    }

    /**
     * Moves the cursor right.
     *
     * If there is no cell to the right, nothing happens.
     */
    this.right = function() {
        if (cursor == null) {
            throw "null cursor";
        }
        cursor = cursor.getRight();
    }

    /**
     * Moves the cursor down.
     *
     * If there is no cell to the down, nothing happens.
     */
    this.down = function() {
        if (cursor == null) {
            throw "null cursor";
        }
        cursor = cursor.getDown();
    }

    /**
     * Sets the position of the cursor to a cell, or row/column header.
     *
     * @param row the row number
     * @param col the column number
     */
    this.setCursor = function(row, col) {

        if (row == 0 && col == 0) {
            throw "Cannot set first";
        }

        if (row == 0) {
            cursor = getColHead(col);
        } else if (col == 0) {
            cursor = getRowHead(row);
        } else {
            cursor = getCellObj(row, col);
        }

    }

    /**
     * May move the cursors of o and this table
     *
     * @param o the object to compare
     * @return T if they contain exactly the same data; F otherwise
     */
    this.equals = function(o) {

        if (!(o instanceof Table)) {
            return false;
        }

        if (o == this) {
            return true;
        }

        var t = o;

        if (t.getHeight() != rows || t.getWidth() != cols) {
            return false;
        }

        t.setCursor(1, 0);
        this.setCursor(1, 0);

        for (var i = 1; i <= rows; i++) {

            if ((this.get() == null || t.get() == null) && t.get() != this.get()) {
                return false;
            }

            if (t.get() != this.get()) {
                return false;
            }
            t.down();
            this.down();
        }

        for (var i = 0; i <= rows; i++) {

            t.setCursor(i, 1);
            this.setCursor(i, 1);

            for (var j = 1; j <= cols; j++) {

                if (t.get() != this.get()) {
                    return false;
                }

                t.right();
                this.right();

            }
        }

        return true;

    }

    this.toString = function() {

        var s = "";

        var row = first;
        var cell = first;

        for (var r = 0; r < rows + 1; r++) {

            for (var c = 0; c < cols + 1; c++) {

                if (cell != first) {
                    s += cell.getContent() + "\t|";
                } else {
                    s += "\t|";
                }
                cell = cell.getRight();

            }

            s += "\n";

            row = row.getDown();
            cell = row;
        }

        return s;

    }

    this.printAll = function() {

        console.log("--");

        for (var r = 0; r <= rows; r++) {

            var out  = "";

            for (var c = 0; c <= cols; c++) {

                var cell;

                if (r == 0 && c == 0) {
                    out += "\t";
                    continue;
                }

                if (r == 0) {
                    cell = getColHead(c);
                } else if (c == 0) {
                    cell = getRowHead(r);
                } else {
                    cell = getCellObj(r, c);
                }

                if (cell != null) {
                    out += (cell.getContent() + (cell.getDown() == null ? "" : "v") + (cell.getRight() == null ? "" : ">") + "\t");
                } else {
                    out += ("\t");
                }

            }

            console.log(out);

        }

        console.log("--\n");

    }

    /**
     * Gets the row header object of the pos-th row
     *
     * @param pos row number
     * @return row header object
     */
    var getRowHead = function(pos) {

        if (pos > rows) {
            throw "This row number is too large. Max row number allowed: " + rows ;
        }

        if (pos < 1) {
            throw "This row number is too small. Min row number allowed: 1";
        }

        var row = first;

        var r = 0;

        while (r < pos) {
            row = row.getDown();
            r++;
        }

        return row;

    }

    /**
     * Get the column header object of the pos-th column
     *
     * @param pos column number
     * @return column header object
     */
    var getColHead = function(pos) {

        if (pos > cols) {
            throw "This column number is too large. Max column number allowed: " + cols;
        }

        if (pos < 1) {
            throw "This column number is too small. Min column number allowed: 1";
        }

        var col = first;

        var c = 0;

        while (c < pos) {
            col = col.getRight();
            c++;
        }

        return col;

    }

    /**
     * Returns the cell object at (row, col)
     *
     * @param row the row number
     * @param col the column number
     * @return the cell object
     */
    var getCellObj = function(row, col) {

        if (row > rows) {
            throw "This row number is too large. Max row number allowed: " + rows;
        }

        if (row < 1) {
            throw "This row number is too small. Min row number allowed: 1";
        }

        if (col > cols) {
            throw "This column number is too large. Max column number allowed: " + cols;
        }

        if (col < 1) {
            throw "This column number is too small. Min column number allowed: 1";
        }

        var cell = getRowHead(row);

        var c = 0;

        while (c < col) {
            cell = cell.getRight();
            c++;
        }

        return cell;

    }

    /**
     * Creates a new table with r rows and c columns
     */
    if(r < 1 || c < 1)
        throw "Table must have at least one cell";

    first = new Cell();
    cursor = first;

    for (var i = 0; i < r; i++) {
        this.newRow();
    }

    for (var j = 0; j < c; j++) {
        this.newCol();
    }

}

