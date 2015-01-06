function runTests(tests){

    var passed = 0;
    var failed = 0;

    var time1 = (new Date()).getTime();

    for(var ele in tests){
        if(typeof(tests[ele]) == "function"){
            try{
                (tests[ele])();
                document.writeln("Test passed: " + ele + "<br />");
                passed++;
            } catch(err){
                document.writeln("Error running test: " + ele + "<br />");
                document.writeln("|     " + err + "<br />");
                // document.writeln("|     " + (new Error().stack) + "<br />");
                failed++;
            }
        }
    }

    var time2 = (new Date()).getTime();

    document.writeln("<br />");

    document.writeln("Passed: " + passed + "<br />");
    document.writeln("Failed: " + failed + "<br /><br />");
    document.writeln(((time2 - time1)/1000) + "s elapsed <br />");

}

function assertTrue(expr){
    if(!expr)
        throw "Assert true failed";
}

function assertFalse(expr){
    if(expr)
        throw "Assert false failed";
}

function assertEquals(o1,o2){
    if(typeof(o1) != typeof(o2))
        throw "Assert equals failed";

    if(typeof(o1) == "object" && o1.hasOwnProperty("equals") && o2.hasOwnProperty("equals")){
        if(!o1.equals(o2))
            throw "Assert equals failed";
    }
    else{
        if(o1 != o2)
            throw "Assert equals failed";
    }
}

function fail(){
    throw "Failed";
}

/* Return an integer between 0(incl) and bound (excl) */
function nextInt(bound){
    var rand = Math.random();
    var integer = bound*rand;
    return Math.floor(integer);
}
