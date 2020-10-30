/*
Title: Assignment 5
Name: Zion "Sean" Ko
Email: zion_ko@student.uml.edu
Affiliation: Umass Lowell COMP 4610 Sec 201 GUI Programming 1
Last update: 2020-10-29
Description: Using JavaScript to create dynamic multiplication table.
Sources: mostly from html cheatsheet, textbook, and notes.
  1. https://www.w3schools.com/js/js_htmldom.asp
  2. https://javascript.info/dom-nodes
  3. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions
  4. https://www.learn-js.org
  5. https://javascript.info
*/

// listens for button click then calls the inputGetter function.
document.getElementById("form-button").addEventListener("click",  inputGetter);

// This function is called when the "submit" button is clicked.
// This function gets  and goes through each inputs and tests if these values are valids.
// If a input value does not pass the test it will output error message.
// When input values all passes the test then it will call myTable function to do the calculation.
function inputGetter() {
    // get min and max from input boxes and store into correct variables
    var colMin = document.getElementById("colRangeMin").value,
        colMax = document.getElementById("colRangeMax").value,
        rowMin = document.getElementById("rowRangeMin").value,
        rowMax = document.getElementById("rowRangeMax").value;
    // Various checks if inputs are valid
    // checking if all boxes are filled
    if (!colMin || !colMax || !rowMin || !rowMax) {
        document.getElementById("errorMessage").innerHTML = "Error! Please input correct values in all boxes.";
    // checking if  all boxes all with integers
    } else if (!(colMin % 1 === 0)|| !(colMax % 1 === 0) || !(rowMin % 1 === 0) || !(rowMax % 1 === 0)) {
        document.getElementById("errorMessage").innerHTML = "Error! All inputs must be regular integers.";
    // checking if the range do not exceed 100 between min and max.
    } else if (Math.abs(rowMin - rowMax) > 100 || Math.abs(colMin - colMax) > 100) {
        document.getElementById("errorMessage").innerHTML = "Error! The range between MINIMUM and MAXIMUM cannot be greater than 100.";
    // checking if the min is not greater than max
    } else if (Number(rowMin) > Number(rowMax) || Number(colMin) > Number(colMax)) {
        document.getElementById("errorMessage").innerHTML = "Error! MINIMUM values cannot be greater than MAXIMUM values.";
    // when all tests are checked
    } else {
        // nothing prints out when it all passes
        document.getElementById("errorMessage").innerHTML = "";
        // Call myTable function (convert and pass in integers only)
        myTable(Number(colMin), Number(colMax), Number(rowMin), Number(rowMax));
    }
}

// myTable function called after values passes all tests.
// It operates on the Document Object Model tree after creating the table;
// It is so I can saparate even and odd rows and I could have probably made things easier
// but I just ended up doing like this.
// The basic idea is going through loops to sort out row and column values, add or multiply
// depending on the situation. Sort out even and odd rows so I could use them to make it
// eaiser to see for users. Also sort out head and tail for later use.
// Then use nested loop to calculate actual values for the table.
// appened the values to where they belong so they are in correct positioin.
// Delete current table and attach newly created table to output correctly.
// sources: 1. https://www.w3schools.com/js/js_htmldom.asp
//          2. https://javascript.info/dom-nodes

function myTable(cMin, cMax, rMin, rMax) {
    // decrease current values there are n + 1 rows and colums
    rMin = rMin - 1;
    cMin = cMin - 1;
    var i, j, tbody = document.createElement('tbody'), tr, te, currentTable;
    // looping by going through row values
    // From the rowMin value to rowMax, create row values and mark them with appropriate
    // names so I can use them later for later use.
    for (i = rMin; i <= rMax; i += 1) {
        tr = document.createElement('tr');
        if (i === rMin) {
            tr.className += " head";
        } else if (i % 2 === 0) {
            tr.className += " even";
        }
        if (i == rMax) {
            tr.className += " tail";
        }
        // nested loop to set numbers into correct locations
        // starting with column values
        for (j = cMin; j <= cMax; j += 1) {
            //the first row and column
            if (j === cMin && i === rMin) {
                te = document.createElement('th');
                tr.appendChild(te);
            // the first column
            } else if (j === cMin) {
                te = document.createElement('th');
                te.className += " colHead"; // to use later in css
                te.innerHTML = i;
                tr.appendChild(te);
            // pretty much doing same thing for row values
            } else if (i === rMin) {
                te = document.createElement('th');
                te.innerHTML = j;
                tr.appendChild(te);
            // and whatever is left multiply
            } else {
                te = document.createElement('td');
                te.innerHTML = j * i;
                tr.appendChild(te);
            }
        }
        // attaching calculated row to table body
        tbody.appendChild(tr);
    }
    //  destross the previous table in the tree
    tableResult = document.getElementById("multTable");
    while (tableResult.firstChild) {
        tableResult.removeChild(tableResult.firstChild);
    }
    // replaces the new table into the tree
    tableResult.appendChild(tbody);
}
