/*
Title: Assignment 6
Name: Zion "Sean" Ko
Email: zion_ko@student.uml.edu
Affiliation: Umass Lowell COMP 4610 Sec 201 GUI Programming 1
Last update: 2020-11-12
Description: Using JavaScript to create dynamic multiplication table.
Sources: mostly from html cheatsheet, textbook, and notes.
  1. https://www.w3schools.com/js/js_htmldom.asp
  2. https://javascript.info/dom-nodes
  3. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions
  4. https://www.learn-js.org
  5. https://javascript.info
  6. https://jqueryvalidation.org/documentation/
*/

$().ready(function () {
    // This will check the value is greater than the parameter
    $.validator.addMethod("greaterThan",
        function (value, element, param) {
            // grab value from parameter
            var $min = $(param);
            if (this.settings.onfocusout) {
                // Making sure if element is greater
                $min.off(".validate-greaterThan").on("blur.validate-greaterThan", function () {
                    $(element).valid();
                });
            }
            // Decides on display the message or not
            return parseInt(value) > parseInt($min.val());
        }, " MAXIMUM must be greater than MINIMUM!");

    // This will check the value is less than the parameter
    $.validator.addMethod("lessThan",
        function (value, element, param) {
            // grab value from parameter
            var $max = $(param);
            if (this.settings.onfocusout) {
                // Making sure if element is less
                $max.off(".validate-lessThan").on("blur.validate-lessThan", function () {
                    $(element).valid();
                });
            }
            return parseInt(value) < parseInt($max.val());
        }, " MINIMUM must be less than MAXIMUM!");

    // This is built in rules that I used to implement validator
    // from the jQuery validation plugin.
    // Must target the form which has id='multForm'
    $('#multForm').validate({
        rules: {
            'colRangeMin': {
                required: true,
                number: true,
                range: [-100, 100],
                lessThan: '#colRangeMax'
            },
            'colRangeMax': {
                required: true,
                number: true,
                range: [-100, 100],
                greaterThan: '#colRangeMin'
            },
            'rowRangeMin': {
                required: true,
                number: true,
                range: [-100, 100],
                lessThan: '#rowRangeMax'
            },
            'rowRangeMax': {
                required: true,
                number: true,
                range: [-100, 100],
                greaterThan: '#rowRangeMin'
            }
        },

        // This chooses the messages for the rules,
        messages: {
            'colRangeMin': {
                required: " Please enter an integer",
                number: " Your input is not an integer",
                range: " Please enter a value between -100 and 100"
            },
            'colRangeMax': {
                required: " Please enter an integer",
                number: " Your input is not an integer",
                range: " Please enter a value between -100 and 100"
            },
            'rowRangeMin': {
                required: " Please enter an integer",
                number: " Your input is not an integer",
                range: " Please enter a value between -100 and 100"
            },
            'rowRangeMax': {
                required: " Please enter an integer",
                number: " Your input is not an integer",
                range: " Please enter a value between -100 and 100"
            }
        },

        //Making sure the form is submitted
        //then runs the inputGetter function to create table
        submitHandler: function() {
            inputGetter();
            return false;
        },

        // It empties the table if the input is invalid.
        invalidHandler: function() {
            $("#multTable").empty();
        }
    });
});

// This function is called when the "submit" button is clicked.
// This function gets  and goes through each inputs and tests if these values are valids.
// If a input value does not pass the test it will output error message.
// When input values all passes the test then it will call myTable function to do the calculation.
function inputGetter() {
//     For ES5 Compatibility
    "use strict";
    // Get the x low and high from input box
    var colMin = document.getElementById("colRangeMin").value,
        colMax = document.getElementById("colRangeMax").value,
        // Get the y low and high from input box
        rowMin = document.getElementById("rowRangeMin").value,
        rowMax = document.getElementById("rowRangeMax").value;

    manipTable(Number(colMin), Number(colMax), Number(rowMin), Number(rowMax));
}

// myTable function called after values passes all tests.
// It operates on the Document Object Model tree after creating the table;
// It is so I can separate even and odd rows and I could have probably made things easier
// but I just ended up doing like this.
// The basic idea is going through loops to sort out row and column values, add or multiply
// depending on the situation. Sort out even and odd rows so I could use them to make it
// easier to see for users. Also sort out head and tail for later use.
// Then use nested loop to calculate actual values for the table.
// appended the values to where they belong so they are in correct positions.
// Delete current table and attach newly created table to output correctly.
// sources: 1. https://www.w3schools.com/js/js_htmldom.asp
//          2. https://javascript.info/dom-nodes
function manipTable(cMin, cMax, rMin, rMax) {
    // For ES5
    "use strict";
    // decrease current values there are n + 1 rows and colums
    rMin = rMin - 1;
    cMin = cMin - 1;
    // looping by going through row values
    // From the rowMin value to rowMax, create row values and mark them with appropriate
    // names so I can use them later for later use.
    var i, j,
        tbody = document.createElement('tbody'),
        tr, te, newTable;
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
                te.className += " colHead";
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
        // replaces the new table into the tree
        tbody.appendChild(tr);
    }
//  destroys the previous table in the tree
    newTable = document.getElementById("multTable");
    while (newTable.firstChild) {
        newTable.removeChild(newTable.firstChild);
    }
    // This then places the newly created tree into the DOM
    newTable.appendChild(tbody);
}
