/* Create an rxc table for testing/rendering */
function createTestTable(r,c){
    var table = new Table(r,c);
    var container = document.getElementById("table_cont");

    /* create row header */
    for(var rr = 1; rr <= r; rr++)
        table.setRow(rr,createCell("r" + rr, "c" + 0, container));

    /* create col header */
    for(var cc = 1; cc <= c; cc++)
        table.setCol(cc,createCell("r" + 0, "c" + cc, container));

    /* create body */
    for(var rr = 1; rr <= r; rr++)
        for(var cc = 1; cc <= c; cc++)
            table.setCell(rr,cc,createCell("r" + rr, "c" + cc, container));

    return table;
}

function GuiTest () {

    this.simpleRenderTest = function() {

        var table = createTestTable(5,7);
        rerender(table);

    }

}
