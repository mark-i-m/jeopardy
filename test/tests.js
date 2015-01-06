function runTests(tests){

    var passed = 0;
    var failed = 0;

    var time1 = (new Date()).getTime();

    for(var ele in tests){
        if(typeof(tests[ele]) == "function"){
            try{
                (tests[ele])();
                document.body.innerHTML += ("<span class='pass'>Test passed: " + ele + "</span><br />");
                passed++;
            } catch(err){
                document.body.innerHTML += ("<span class='fail'>Error running test: " + ele + "</span><br />");
                document.body.innerHTML += ("<span class='error'>" + err + "</span><br />");
                failed++;
            }
        }
    }

    var time2 = (new Date()).getTime();

    document.body.innerHTML += ("<br />");

    document.body.innerHTML += ("Passed: " + passed + "<br />");
    document.body.innerHTML += ("Failed: " + failed + "<br /><br />");
    document.body.innerHTML += (((time2 - time1)/1000) + "s elapsed <br />");

}

function assertTrue(expr){
    if(!expr)
        throw "Assert true failed <br />" + (new Error().stack.replace(/\n/g,"<br />"));
}

function assertFalse(expr){
    if(expr)
        throw "Assert false failed <br />" + (new Error().stack.replace(/\n/g,"<br />"));
}

function assertEquals(o1,o2){
    if(typeof(o1) != typeof(o2))
        throw "Assert equals failed <br />" + (new Error().stack.replace(/\n/g,"<br />"));

    if(typeof(o1) == "object" && o1.hasOwnProperty("equals") && o2.hasOwnProperty("equals")){
        if(!o1.equals(o2))
            throw "Assert equals failed <br />" + (new Error().stack.replace(/\n/g,"<br />"));
    }
    else{
        if(o1 != o2)
            throw "Assert equals failed <br />" + (new Error().stack.replace(/\n/g,"<br />"));
    }
}

function fail(){
    throw "Failed <br />" + (new Error().stack.replace(/\n/g,"<br />"));
}

/* Return an integer between 0(incl) and bound (excl) */
function nextInt(bound){
    var rand = Math.random();
    var integer = bound*rand;
    return Math.floor(integer);
}
