// selec5t the areas from the html document
var $table_row = document.querySelector("tbody.PROOF_OF_ALIENS");
var $renderedRow = $table_row.querySelectorAll("tr");
var $input_date = document.querySelector("#search_date");
var $search_button = document.querySelector("#submit_search");

// add eventListener to search button when clicked
$search_button.addEventListener("click", search_date);

// Search date function
function search_date(){
    // Format the user's search by removing leading and trailing whitespace.
    var inputDate = $input_date.value.trim();
    console.log(inputDate);
    
    // Set filtered dates to an array of all values which match the filter
    var result = dataSet.map(a => a['datetime']);
    var filteredDataSet = [];
    for (i=0; i<dataSet.length; i++){
        var datetime = dataSet[i].datetime;
        if (datetime == inputDate) {
        filteredDataSet.push(dataSet[i]);
        }
    }
    
    render_table(filteredDataSet);
    
}

function render_table(some_data){
/* calls dataSet from data.js. Loop through and insert rows first */ 
/*    first clears input field  */
    $input_date.value = "";
    /* clear any previous table rows */
    while($table_row.firstChild){
        $table_row.removeChild($table_row.firstChild);
    }

    /* generate table */
    for (i=0; i<some_data.length; i++){
        var data = some_data[i];
        var row = $table_row.insertRow(i);
        var keys = Object.keys(data) //returns the keys for each "entry" in the object
        var col_length = keys.length - 1;
        //console.log(i + "/" + some_data.length); //tracking progress of the loop
        /* loop through columns and sets columns, excluding "durationMinutes" data */
        for (j=0; j<col_length; j++){
            var cell = row.insertCell(j);
            if (keys[j] != "durationMinutes") {
                var data_value = data[keys[j]]; //this is the value of the dataSet at entry number i and key number j 
                cell.innerText = data_value;
            }
            else {
                var data_value = data[keys[j+1]]; //moves on to the next value
                cell.innerText = data_value;
            }
        }
    }
}

// Render the table for the first time on page load
render_table(dataSet)