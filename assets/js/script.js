//Event listener for distance select
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var options = "";
  var instances = M.FormSelect.init(elems, options);
});

  
var dontStealThis = "AIzaSyC7BB3RT0eLCTCmv67coQEu9B7HT5YnnD4"
  //input selecter variables
  
  var mainForm = document.getElementById("mainform");
  var submitBtn = document.getElementById("submitbtn");
  
  var searchFunction = function(event){
    var locationInput = document.getElementById("location");
    var distanceInput = document.getElementById("distance");
    event.preventDefault();
    var locationInput = locationInput.value;
    var distanceInput = distanceInput.value;
    //saveSearches(locationInput);
    console.log(locationInput);
    console.log(distanceInput);
    let apiAddress = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + locationInput + "radius=" + distanceInput + "&type=campground&keyword=cruise&key=" + dontStealThis;
    fetch(apiAddress)
        .then(function (response) {
          if (response.ok)
          return response.json();
          })
          .then(function (data) {
            console.log(data)
        })
  };
      
  mainForm.addEventListener("submit", searchFunction);
      
=======

var dontStealThis = 
//input selecter variables
var locationInput = document.getElementById("location");
var distanceInput = document.getElementById("distance");
var submitBtn = document.getElementById("submitbtn");
var mainForm = document.getElementById("mainform");


var searchFunction = function(event){
  event.preventDefault();
  let locationInput = locationInput.value;
  let distanceInput = distanceInput.value;
  saveSearches(locationInput);
  console.log(locationInput);
  console.log(distanceInput);
  let apiAddress = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + locationInput + "radius=" + distanceInput + "&type=campground&keyword=cruise&key=" + dontStealThis;
  fetch(apiAddress)
      .then(function (response) {
      return response.json();
      })
      .then(function (data) {
      console.log(data)
  })
};

mainForm.addEventListener("submit", searchFunction);




