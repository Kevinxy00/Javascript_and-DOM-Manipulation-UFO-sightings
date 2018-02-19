// setting variables 
    // select the areas from the html document
var $table_row = document.querySelector("tbody.PROOF_OF_ALIENS");
var $renderedRow = $table_row.querySelectorAll("tr");
    // get user inputs for the search filter
var $input_date = document.querySelector("#search_date");
var $input_city = document.querySelector("#search_city");
var $input_state = document.querySelector('#search_state');
var $input_country = document.querySelector('#search_country');
var $input_shape = document.querySelector('#search_shape');
    // pagination
var $result_page = document.querySelector(".pagination");
    // search button submit
var $search_button = document.querySelector("#submit_search");
    //show all button 
var $showAll_button = document.querySelector("#show_All");
    // add eventListener to search button and show all button when clicked
$search_button.addEventListener("click", search_multi);
$showAll_button.addEventListener("click", show_all);

var page = 1;
var records_per_page = 50; 

// Function: Search multiple filters (or just one filter or even none at all) 
function search_multi(){
    // Format the user's search by removing leading and trailing whitespace.
    var inputDate = $input_date.value.trim();
    var inputCity =  $input_city.value.trim().toLowerCase();
    var inputState = $input_state.value.trim().toLowerCase();
    var inputCountry =  $input_country.value.trim().toLowerCase();
    var inputShape =  $input_shape.value.trim().toLowerCase();

    console.log(inputDate);
    
    // *** Set filtered dates to an array of all values which match the filter ***
    /*** 
    Using the filter function, user can set multiple filters and search for UFO sightings using 
    the following criteria based on the table columns: 
    ***/ 
        // checking if any input vars have no value
        var filteredInputs = {"datetime" : inputDate, "city" : inputCity, "state" : inputState, 
            "country" : inputCountry, "shape" : inputShape};
        for (var key in filteredInputs){
            // if has no value, then delete
            if (filteredInputs[key] == ""){
                delete filteredInputs[key];
            }
        } 
    console.log(filteredInputs);

    if (Object.keys(filteredInputs).length != 0){ // if filtered object is not empty
        filteredDataSet = dataSet.filter(function(item) { //filters dataSet from data.js using a function
            for (key in filteredInputs){ // for each key in the filteredArray object
                if(item[key] === undefined || item[key] == "" || item[key].trim().toLowerCase() != filteredInputs[key]) 
                /* does not return the current item from dataSet if item at [key] is undefined or nothing
                or if the values from dataSet and filteredArray don't match at the keys*/
                    return false;
            }
            return true; /* if not(key-values do not match), then the item passes the filter and 
            is included in the filteredDataSet array */  
        });
        console.log(filteredDataSet.length);
        paginate_data(some_data=filteredDataSet, perPageCt = 50, page_num=1);
        render_pagination(some_data=filteredDataSet, perPageCt = 50, page_num=1);
    } 
    else { //if length of keys in filteredInputs is == 0
        filteredDataSet = [];
        render_table(filteredDataSet);
        render_pagination(filteredDataSet);
    }

} // end of search_multi(); 


// Function: Show all rows 
function show_all(){
    render_pagination(dataSet, perPageCt=500, page_num=1);
    paginate_data(some_data=dataSet, perPageCt=100, page_num=1);
} // end show_all();


// Pagination without use of jquery 
// render the pagination lists
// @TODO: find a way to get user's desired per page Ct (how many results shown at once) or set it

function render_pagination(some_data, perPageCt=50, page_num=1) { // parameters: list of objects and page number to start
    // just making sure the parameters do not default to the default values
    var some_data = some_data;
    var perPageCt = perPageCt;
    var page_num = page_num;

    // clear all previous paginations:
    while($result_page.firstChild){
        $result_page.removeChild($result_page.firstChild);
    }

    var quotient = Math.ceil(some_data.length / perPageCt); // get total # of pages needed to encompass all data.
   
    for (var i=0; i<quotient; i++) { // create buttons and append under "pagination" <ul>. 
        var newPageLink = document.createElement('button');
        var currentPageNum = i + 1;
        newPageLink.innerText = currentPageNum;
        newPageLink.setAttribute("class", "page_button");
        newPageLink.setAttribute("id", currentPageNum);
        // add event listener for each button
        newPageLink.addEventListener("click", function (){ // to pass multiple functions with custom params
            var current_button = this.id;
            console.log("button clicked: " + current_button);
            paginate_data(some_data=some_data, perPageCt, page_num=current_button);
        });
        $result_page.appendChild(newPageLink); // append new pagination under the pagination <ul> 
        
    }   
     /* add eventListener for each page button 
    var page_links = $result_page.querySelectorAll(".page_button");
    for (var i=0; i < page_links.length; i++){
        // get current number from the button
        current_page_num = Number(page_links[i].innerText);
        console.log(current_page_num);
        // add event listener for each button
        page_links[i].addEventListener("click", function(){ // to pass multiple functions with custom params
            paginate_data(some_data=some_data, perPageCt, page_num=current_page_num);
            //render_pagination(some_data=some_data, perPageCt, page_num=current_page_num);
        });
    } 
    */
}

// calculate page number, slice data accordingly, and call render_table() on the new data. 
function paginate_data(some_data, perPageCt=50, page_num=1) { // parameters: object, number of results displayed per page, page number    
    startIndex = (page_num - 1) * perPageCt; 
    endIndex =  startIndex + perPageCt; 
    
    var slicedArray = some_data.slice(startIndex, endIndex); // Can slice object by index, 
    // but may return [Object{}, Object{}, ...], which could cause problems when passing into render_table 
    render_table(slicedArray); 
    console.log(page_num);
    console.log("start: " + startIndex + "; end: " + endIndex);
}


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

/*
// pagination with jquery
$(document).ready(function() {
    $('#main').DataTable();
} ); */