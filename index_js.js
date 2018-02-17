// select the areas from the html document
var $table_row = document.querySelector("tbody.PROOF_OF_ALIENS");
var $renderedRow = $table_row.querySelectorAll("tr");
    // get user inputs for the search filter
var $input_date = document.querySelector("#search_date");
var $input_city = document.querySelector("#search_city");
var $input_state = document.querySelector('#search_state');
var $input_country = document.querySelector('#search_country');
var $input_shape = document.querySelector('#search_shape');
    // search button submit
var $search_button = document.querySelector("#submit_search");

// add eventListener to search button when clicked
$search_button.addEventListener("click", search_all);

// Search date function
function search_all(){
    // Format the user's search by removing leading and trailing whitespace.
    var inputDate = $input_date.value.trim();
    var inputCity =  $input_city.value.trim().toLowerCase();
    var inputState = $input_state.value.trim().toLowerCase();
    var inputCountry =  $input_country.value.trim().toLowerCase();
    var inputShape =  $input_shape.value.trim().toLowerCase();

    console.log(inputDate);
    
    // *** Set filtered dates to an array of all values which match the filter ***

    //      Next section has a better method of doing this, along with filtering multiple criteria.
    /* var filteredDataSet = [];
    for (i=0; i<dataSet.length; i++){
        var datetime = dataSet[i].datetime;
        if (datetime == inputDate) {
        filteredDataSet.push(dataSet[i]);
        }
    } */

    /*** 
    Using the filter function, user can set multiple filters and search for UFO sightings using 
    the following criteria based on the table columns: 
    ***/ 
        // checking if any input vars have no value
        var filteredArray = {"datetime" : inputDate, "city" : inputCity, "state" : inputState, 
            "country" : inputCountry, "shape" : inputShape};
        for (var key in filteredArray){
            // if has no value, then delete
            if (filteredArray[key] == ""){
                delete filteredArray[key];
            }
        } 
    console.log(filteredArray);

    filteredDataSet = dataSet.filter(function(item) { //filters dataSet from data.js using a function
        for (key in filteredArray){ // for each key in the filteredArray object
            if(item[key] === undefined || item[key] != filteredArray[key]) /* does not return the 
            current item from dataSet if item at [key] is undefined or if the values from dataSet and filteredArray 
            don't match at the keys*/
                return false;
        }
        return true; /* if not(key-values do not match), then the item passes the filter and 
        is included in the filteredDataSet array */
        
        console.log(filteredDataSet);    
    });
    console.log(filteredDataSet.length);
    render_table(filteredDataSet);
} // end of search_all(); 

function render_table(some_data){
/*** calls dataSet from data.js. Loop through and insert rows first ***/ 
/*    first clears input field  */
    $input_date.value = "";
    $input_city.value = "";
    $input_state.value = "";
    $input_country.value = "";
    $input_shape.value = "";
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
// render_table(dataSet)