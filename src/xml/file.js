/*
 * This file contains code for generating and parsing xml
 * for games
 */

/**
 * Generates xml for the currently loaded game
 */
function generateGameXML() {
    var xml = "";

    // <game name="">
    //    <category ...> ...
    //    <category ...> ...
    //    <category ...> ...
    // </game>

    // get all categories
    var catContainers = document.getElementById("main-content")
                                .getElementsByClassName("category-container");

    var gameName = document.getElementById("game-name").value;
    xml += "<game name=\"" + escape(gameName) +"\" id=\"" + gameId + "\">\n";

    // go through each category
    for (var category = 0; category < catContainers.length; category++) {
        xml += "\t" + generateCategoryXML(catContainers[category]).replace("\n","\n\t");
    }

    xml += "</game>";

    // return the xml
    return xml;
}

/**
 * Helper function that generates XML representing
 * the given element's category
 */
function generateCategoryXML(catCont) {
    var xml = "";

    // <category name="">
    //    <qa ... />
    //    <qa ... />
    //    <qa ... />
    // </category>

    // get all questions
    var qaContainers = catCont.getElementsByClassName("qa-container");

    var catName = catCont.getElementsByTagName("input")[0].value;
    xml += "<category name=\"" + escape(catName) + "\">\n";

    // go through each question
    for (var qa = 0; qa < qaContainers.length; qa++) {
        xml += "\t" + generateQaXML(qaContainers[qa]).replace("\n","\n\t");
    }

    xml += "</category>\n";

    // return the xml
    return xml;
}

/**
 * Helper function that generates XML representing
 * the given element's question, answer, and value
 */
function generateQaXML(qaCont) {
    var xml = "";

    // <qa q="" a="" value="" />

    var v = qaCont.getElementsByTagName("input")[0].value;
    var q = qaCont.getElementsByTagName("textarea")[0].value;
    var a = qaCont.getElementsByTagName("textarea")[1].value;

    xml += "<qa q=\"" + escape(q)
        + "\" a=\"" + escape(a)
        + "\" value=\"" + escape(v)
        + "\" />\n";

    return xml;
}

/**
 * A simple lexer for my "brand" of simple XML.
 *
 * It takes a string of XML and produces a list
 * of tokens representing the tags.
 *
 * Assumes there is no "loose" text in the xml
 * all text is in the attributes and escaped.
 */
function lexXML(xml) {
    var tokens = [];

    var currentToken = "";
    for (var i = 0; i < xml.length; i++) {
        var currentChar = xml.charAt(i);

        currentToken += currentChar;

        if (currentChar === ">") {
            tokens.push(analyzeToken(currentToken.trim()));
            currentToken = "";
        }
    }

    return tokens;
}

/**
 * A helper function for the lexer that takes a
 * string representing a tag and produces a js object
 * representing the token.
 */
function analyzeToken(tok) {
    var firstTwo = tok.substring(0,2);
    var lastTwo = tok.substring(tok.length - 2, tok.length);

    var n = getTagName(tok);
    var a = getTagAttributes(tok);
    var t = "";

    if (firstTwo === "</") { // closing tag
        t = "closing";
    } else if (lastTwo === "/>") { // one-sided tag
        t = "one-sided";
    } else { // opening tag
        t = "opening";
    }

    return {name: n, attr: a, type: t};
}

/**
 * A helper function that takes a string representing
 * an xml tag and returns the tag name
 */
function getTagName(tok) {
    var name = "";

    // skip opening < or </
    if (tok.substring(0,2) === "</") {
        tok = tok.substring(2,tok.length);
    } else {
        tok = tok.substring(1,tok.length);
    }

    // get name
    for (var i = 0; i < tok.length; i++) {
        var c = tok.charAt(i);
        if (c === ">" ||
            c === "/" ||
            c === " ") {
            break;
        }
        name += c;
    }

    return name;
}

/**
 * A helper function that takes a string representing
 * an xml tag and returns a list of attributes in the
 * form [{attr: "", value: ""}]
 */
function getTagAttributes(tok) {
    var attrs = [];

    // skip tag name
    var i = 0;
    for (; i < tok.length; i++) {
        var c = tok.charAt(i);
        if (c === " ") {
            break;
        } else if (c === ">" ||
                   c === "/") {
            return [];
        }
    }

    // trim off tag end
    tok = tok.substring(i+1, tok.length)
             .replace("/>"," ")
             .replace(">", " ")
             .trim();

    // split attributes
    var pieces = tok.split(" ");

    for (var j = 0; j < pieces.length; j++) {
        var nameVal = pieces[j].split("=");

        attrs.push({attr: nameVal[0],
            value: nameVal[1].substring(1, nameVal[1].length-1)});
    }

    return attrs;
}

// returns {ast, # tokens consumed}
/**
 * A simple parser for my simple xml. It takes a list of
 * tokens produced by the lexer and generates a simple
 * AST from it.
 *
 * The return is of the form
 * {tree, numTok}
 * where tree is the AST and numTok is the
 * number of tokens in the given list that were consumed
 * in creating the tree.
 *
 * Each tree is of the form
 * {name: "", attr: [], children: [tree]}
 * the attr list is exactly the same as those produced
 * by the lexer. Each child in the list is of the same
 * recurrsive form as the parent.
 */
function parseXML(tokens) {
    var ast = {name: "", attr: [], children: []};

    var outerMost = tokens[0];
    var i;

    switch(outerMost.type) {
        case "opening":
            ast.name = outerMost.name;
            ast.attr = outerMost.attr;

            // find and recursively parse children
            for (i = 1; i < tokens.length; i++) {

                // wait for closing tag
                if (tokens[i].name === ast.name &&
                    tokens[i].type === "closing") {
                    break;
                }

                var parse = parseXML(tokens.slice(i,tokens.length-1));
                ast.children.push(parse.tree);
                i += parse.numTok - 1;
            }

            if (!(tokens[i].name === ast.name &&
                  tokens[i].type === "closing")) {
                throw "Error: no closing tag";
            }

            break;
        case "one-sided":
            // no children
            ast.name = outerMost.name;
            ast.attr = outerMost.attr;
            i = 0;
            break;
        case "closing":
            throw "Error: mismatching tags";
    }

    return {tree: ast, numTok: (i+1)};
}

// debugging
// returns a string representation of the AST
function printAST(ast) {
    var ret = "";

    ret += ast.name;

    for (var i = 0; i < ast.attr.length; i++) {
        ret += " " + ast.attr[i].attr + "=\""
                   + ast.attr[i].value + "\"";
    }

    ret += "\n";

    for (var i = 0; i < ast.children.length; i++) {
        ret += "\t" + printAST(ast.children[i]).replace("\n","\n\t");
    }

    if(ast.children.length > 0) {
        ret += "\n";
    }

    return ret;
}
