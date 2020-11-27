/*
Title: Assignment 7
Name: Zion "Sean" Ko
Email: zion_ko@student.uml.edu
Affiliation: Umass Lowell COMP 4610 Sec 201 GUI Programming 1
Last update: 2020-11-26
Description: Using JavaScript to create dynamic multiplication table.
Sources: mostly from html cheatsheet, textbook, and notes.
  1. https://www.w3schools.com/js/js_htmldom.asp
  2. https://javascript.info/dom-nodes
  3. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions
  4. https://www.learn-js.org
  5. https://javascript.info
  6. https://jqueryvalidation.org/documentation/
  7. https://jesseheines.com/~heines/91.461/91.461-2015-16f/461-assn/jQueryUI1.8_Ch03_TabsWidget.pdf
  8. https://jesseheines.com/~heines/91.461/91.461-2015-16f/461-assn/jQueryUI1.8_Ch06_SliderWidget.pdf
  9. https://jqueryui.com
*/

$().ready(function () {
    // This will intialize tabs in the UI plugin
    var tabs = $("#tabs").tabs();

    // This will delete all tabs and at the same time select deleted tabs element
    var tabDestroyer = $("#delete-tabs");
    tabDestroyer.click( function() {  // delete if delete-tabs is clicked
        var numTabs = $("#tabs ul li").length;
        while (numTabs > 2) {  // I just need to iterate through the list of tabs except for the first two
            var panelId = $("#tabs ul li").last().remove().attr( "aria-controls" );
            $( "#" + panelId ).remove();  // delete all tabs
            numTabs = $("#tabs ul li").length;
        }
        $("#table-maker").click();
        tabs.tabs( "refresh" );
    });

    // This will delete individual tabs instead of all tabs
    tabs.on( "click", "span.ui-icon-close", function() {  // close icon will remove the tab on click
        var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" ); // just to select the list element
        $( "#" + panelId ).remove();
        tabs.tabs( "refresh" );
    });

    // 1. This is for the first slider (3 other sliders are very similar)
    var handle = $( "#custom-handle" );
    var colRangeMin = $( "#col-range-min" );
    $( "#slider" ).slider({
        min: -100, max: 100,  // set the range between -100 and 100
        create: function() {
            handle.text( $( this ).slider( "value" ) );
        },
        slide: function( event, ui ) {
            // if the slider is changed, value in the slider and the input box changes
            handle.text( ui.value );
            colRangeMin.val( ui.value );
            // manually triggers the update on the form to validate the change
            colRangeMin.blur();
            colRangeMin.focus();
            // update the table with the new form
            inputGetter();
        }
    });

    // this is for when input is changed, slider will display the change (3 other sliders are very similar)
    var colRangeMinInitialValue = $("#slider").slider("option", "value");
    colRangeMin.val(colRangeMinInitialValue);
    colRangeMin.change(function() {
        // Makes a copy of the old value
        var oldValue = $("#slider").slider("option", "value"); // make the copy of previous value
        var newValue = $(this).val();
        if (isNaN(newValue) || newValue < -100 || newValue > 100) {  // validate input and previous value is restored if it fails
            colRangeMin.val(oldValue);
        } else {  // else slider display the new value, and changed accordingly
            $("#slider").slider("option", "value", newValue);
            handle.text(newValue);
            inputGetter();  // update the form
        }
    });

    // This function is for the second slider.
    var handle2 = $( "#custom-handle2" );
    var colRangeMax = $( "#col-range-max" );
    $( "#slider2" ).slider({
        min: -100, max: 100,
        create: function() {
            handle2.text( $( this ).slider( "value" ) );
        },
        slide: function( event, ui ) {
            handle2.text( ui.value );
            colRangeMax.val( ui.value );
            colRangeMax.blur();
            colRangeMax.focus();
            validate();
            inputGetter();
        }
    });

    var colRangeMaxInitialValue = $("#slider2").slider("option", "value");
    colRangeMax.val(colRangeMaxInitialValue);
    colRangeMax.change(function() {
        var oldValue = $("#slider2").slider("option", "value");
        var newValue = $(this).val();
        if (isNaN(newValue) || newValue < -100 || newValue > 100) {
            colRangeMax.val(oldValue);
        } else {
            $("#slider2").slider("option", "value", newValue);
            handle2.text(newValue);
            inputGetter();
        }
    });

    // This function is for the third slider.
    var handle3 = $( "#custom-handle3" );
    var rowRangeMin = $( "#row-range-min" );
    $( "#slider3" ).slider({
        min: -100, max: 100,
        create: function() {
            handle3.text( $( this ).slider( "value" ) );
        },
        slide: function( event, ui ) {
            handle3.text( ui.value );
            rowRangeMin.val( ui.value );
            rowRangeMin.blur();
            rowRangeMin.focus();
            inputGetter();
        }
    });

    var rowRangeMinInitialValue = $("#slider3").slider("option", "value");
    rowRangeMin.val(rowRangeMinInitialValue);
    rowRangeMin.change(function() {
        var oldValue = $("#slider3").slider("option", "value");
        var newValue = $(this).val();
        if (isNaN(newValue) || newValue < -100 || newValue > 100) {
            rowRangeMin.val(oldValue);
        } else {
            $("#slider3").slider("option", "value", newValue);
            handle3.text(newValue);
            inputGetter();
        }
    });

    // This function is for the fourth slider
    var handle4 = $( "#custom-handle4" );
    var rowRangeMax = $( "#row-range-max" );
    $( "#slider4" ).slider({
        min: -100,
        max: 100,
        create: function() {
            handle4.text( $( this ).slider( "value" ) );
        },
        slide: function( event, ui ) {
            handle4.text( ui.value );
            rowRangeMax.val( ui.value );
            rowRangeMax.blur();
            rowRangeMax.focus();
            inputGetter();
        }
    });

    var rowRangeMaxInitialValue = $("#slider4").slider("option", "value");
    rowRangeMax.val(rowRangeMaxInitialValue);
    rowRangeMax.change(function() {
        var oldVal = $("#slider4").slider("option", "value");
        var newVal = $(this).val();
        if (isNaN(newVal) || newVal < -100 || newVal > 100) {
            rowRangeMax.val(oldVal);
        } else {
            $("#slider4").slider("option", "value", newVal);
            handle4.text(newVal);
            inputGetter();
        }
    });
    validate(); // Calling this function to validate sliders inputs
});

function validate() {
    // This will check the value is greater than the parameter
    $.validator.addMethod("greaterThan",
        function (value, element, param) {
            // grab value from parameter
            var $min = $(param);
            if (this.settings.onfocusout) {
                // Making sure if element is greater
                $min.off(".validate-greaterThan").on(
                    "blur.validate-greaterThan", function () {
                        $(element).valid();
                    });
            }
            // Decides on display the message or not
            return parseInt(value) >= parseInt($min.val());
        }, "Error: MAX must be greater than MIN!");

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
            return parseInt(value) <= parseInt($max.val());
        }, "Error: MIN must be less than MAX!");

    // This is built in rules that I used to implement validator
    // from the jQuery validation plugin.
    // Must target the form which has id='multForm'
    $('#multForm').validate({
        rules: {
            'col-range-min': {
                required: true,
                number: true,
                range: [-100, 100],
                lessThan: '#col-range-max'
            },
            'col-range-max': {
                required: true,
                number: true,
                range: [-100, 100],
                greaterThan: '#col-range-min'
            },
            'row-range-min': {
                required: true,
                number: true,
                range: [-100, 100],
                lessThan: '#row-range-max'
            },
            'row-range-max': {
                required: true,
                number: true,
                range: [-100, 100],
                greaterThan: '#row-range-min'
            }
        },


        // This chooses the messages for the rules,
        messages: {
            'col-range-min': {
                required: "Please enter a number",
                number: "Your input is not a number",
                range: " Please enter a value between [-100, 100]"
            },
            'col-range-max': {
                required: "Please enter a number",
                number: "Your input is not a number",
                range: " Please enter a value between [-100, 100]"
            },
            'row-range-min': {
                required: "Please enter a number",
                number: "Your input is not a number",
                range: " Please enter a value between [-100, 100]"
            },
            'row-range-max': {
                required: "Please enter a number",
                number: "Your input is not a number",
                range: " Please enter a value between [-100, 100]"
            }
        },

        //Making sure the form is submitted
        //then runs the inputGetter function to create table
        submitHandler: function() {
            inputGetter();
            tabMaker(); // this will call the function hat create tabs
            return false;
        },
        // It empties the table if the input is invalid.
        invalidHandler: function() {
            $("#multTable").empty();
        }
    });
}


// manipTable function called after values passes all tests.
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
function manipTable(colMin, colMax, rowMin, rowMax) {
    //  For ES5
    "use strict";
    // decrease current values there are n + 1 rows and colums
    rowMin = rowMin - 1;
    colMin = colMin - 1;
    // looping by going through row values
    // From the rowMin value to rowMax, create row values and mark them with appropriate
    // names so I can use them later for later use.
    var i, j,
        tbody = document.createElement('tbody'),
        tr, te, originalTable;
    for (i = rowMin; i <= rowMax; i += 1) {
        tr = document.createElement('tr');
        if (i === rowMin) {
            tr.className += " head";
        } else if (i % 2 === 0) {
            tr.className += " even";
        }
        if (i == rowMax) {
            tr.className += " tail";
        }
        // nested loop to set numbers into correct locations
        // starting with column values
        for (j = colMin; j <= colMax; j += 1) {
            //the first row and column
            if (j === colMin && i === rowMin) {
                te = document.createElement('th');
                tr.appendChild(te);
                // the first column
            } else if (j === colMin) {
                te = document.createElement('th');
                //  Being marked as x-head so it can be colored white instead
                te.className += " col-head";
                te.innerHTML = i;
                tr.appendChild(te);
                // pretty much doing same thing for row values
            } else if (i === rowMin) {
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
    originalTable = document.getElementById("multTable");
    while (originalTable.firstChild) {
        originalTable.removeChild(originalTable.firstChild);
    }
    // This then places the newly created tree into the DOM
    originalTable.appendChild(tbody);
}

// This function is called when the "Create Tab" button is clicked.
// This function gets  and goes through each inputs and tests if these values are valids.
// If a input value does not pass the test it will output error message.
// When input values all passes the test then it will call myTable function to do the calculation.
function inputGetter() {
//      For ES5 Compatibility
    "use strict";
    // Get the x low and high from input box
    var cMin = document.getElementById("col-range-min").value,
        cMax = document.getElementById("col-range-max").value,
        // Get the y low and high from input box
        rMin = document.getElementById("row-range-min").value,
        rMax = document.getElementById("row-range-max").value;
    //  Check the inputs are valid
    //  First by checking none of the fields are empty or non numbers
    if (!cMin || !cMax || !rMin || !rMax) {
        //  document.getElementById("error-message").innerHTML = "Invalid Input: Please make sure you have inputted all numbers correctly.";
        //  Then check that the numbers are integers
    } else if (!(cMin % 1 === 0)|| !(cMax % 1 === 0) || !(rMin % 1 === 0)
        || !(rMax % 1 === 0)) {
    }
        //  Then check that the low is not greater than the high
        // else if (Math.abs(rMin - rMax) > 100 || Math.abs(cMin - cMax) > 100) {     //only 100
    //     //  Then check that the low is not greater than the high
    // }
    else if (Number(rMin) > Number(rMax) || Number(cMin) > Number(cMax)) {
        //  Then execute the function manipTable, which builds a chart and switches the chart on the DOM tree
    } else {
        //  Call the function
        manipTable(Number(cMin), Number(cMax), Number(rMin), Number(rMax));
    }
}

// This is to make tabs and give names
function tabMaker() {
    // The tabs need to be numbered so it gets the length
    var numTabs = $("#tabs ul li").length + 1;

    // to handle all names of tabs
    $("#tabs ul").append(


        "<li><a href='#tab" + numTabs + "'>" + "Col ("
        + $("#col-range-min").val() + "..."
        + $("#col-range-max").val() + "), Row ("
        + $("#row-range-min").val() + "..."
        + $("#row-range-max").val() + ")" +
        // to add the ui-icon for closing tabs
        // "</a><span class='ui-icon ui-icon-close' role='presentation'>"
        // + "Delete</span></li>"
    "</a><span class='ui-icon ui-icon-close' role='presentation'>Delete</span></li>"
    );

    // appending forms created inside of the tab
    $("#tabs").append(
        "<div id='tab" + numTabs + "'>" + $("#tableDiv").html() + "</div>"
    );
    // refresh everything when done
    $("#tabs").tabs("refresh");
}

