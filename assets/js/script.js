var submitBtn = document.getElementById("submitbtn");
var mainForm = document.getElementById("mainform");
const APIKey = "92421b7f2bf12b73f6e7c38295c935c0";
var DateTime = luxon.DateTime;
var dontStealThis = "AIzaSyC7BB3RT0eLCTCmv67coQEu9B7HT5YnnD4";
var lonLat;

//Event listener for distance select
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('select');

  var options = "";
  var instances = M.FormSelect.init(elems, options);
});
//gets coordinates of inital zipcode
function getLonLat(event) {
  event.preventDefault();
  var locationInput = document.getElementById("location");
  var locationInput = locationInput.value;
  // saveSearches(locationInput);
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + locationInput + ",US&units=imperial&appid=" + APIKey;

  fetch(queryURL)
    .then(function (response) {
      response.json().then(function (data) {
        console.log(data);
        lonLat = data.coord.lat + "," + data.coord.lon;
        searchFunction(lonLat);

      });
    })
}
//searches campgrounds within distance radius of zipcode
var searchFunction = function (lonLat) {
  var distanceInput = document.getElementById("distance");
  var distanceInput = distanceInput.value;
  if (distanceInput = " " ) {
    // make an alert with a widget saying must include distance
  }
  let apiAddress =
    "https://cors-anywhere.herokuapp.com/" + "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
    lonLat +
    "&radius=" +
    distanceInput +
    "&type=campground&keyword=cruise&key=" +
    dontStealThis;
  console.log(lonLat);
  fetch(apiAddress)
    .then(function (response) {
      response.json()
        .then(function (data) {
          campgroundResults(data);
        })
    })
}

function campgroundResults(data) {
console.log(data);
var campgrounds = data.results;
for (i=0; i<campgrounds.length; i++) {
  var coord = campgrounds[i].geometry.location;
  var name = campgrounds[i].name;
  var address = campgrounds[i].vicinity;
  if (campgrounds[i].opening_hours.open_now = true)
  {
    //textContent = OPEN
  }
  else {
    //textContent = CLOSED
  }
searchFiveDayWeather(coord);
}
}

//fetches 7 day weather 
function searchFiveDayWeather(coord) {
  var lat = coord.lat;
  var lon = coord.lng;
  var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;
  
  fetch(queryURL)
    .then(function (response) {
      response.json().then(function (data) {
        renderWeather(data);
      })
    })
}

function renderWeather(data) {
  //gets date from zipcode and displays it nice
  var local = DateTime.local();
  var rezoned = local.setZone(data.timezone);
  var format = rezoned.toFormat("'('M'/'d'/'y')'");
  // dateHeader.textContent = format;
  //have to create element and append current date



  //parses and appends weather for current day + 6 future days
  for (i = 0; i < data.daily.length; i++) {

    //Creates divs for each daily weather if we want them
    // var div = document.createElement("div");
    //     div.classList.add("dailyDiv");
    //     fiveDayForecast.appendChild(div);
    //     var dailyDiv = document.querySelectorAll(".dailyDiv");

    //calculates date for zipcode and displays nicely for each future date
    var addDay = rezoned.plus({ days: i + 1 })
    var newDate = addDay.toFormat("cccc','LLL','d','y");
    //parses out weather data
    var dailyWeatherDesc = data.daily[i].weather[0].description;
    var icon = getIcons(data.daily[i].weather[0].icon);
    var temp = data.daily[i].temp.max.toFixed(2);
    var wind = data.daily[i].wind_speed.toFixed(2);
    var humidity = data.daily[i].humidity;
    console.log(dailyWeatherDesc);
    var futureDate = document.createElement("h1");
    futureDate.classList.add('dailyDate');
    futureDate.textContent = newDate;
    var img = document.createElement("img");
    img.src = icon;
    img.alt = "Weather Icon";
    //Create elemenets and append depending on where we want them

    // var ul = document.createElement("ul");
    // var tempList = document.createElement("li");
    // var windList = document.createElement("li");
    // var humidityList = document.createElement("li");
    // tempList.textContent = "Temp: " + temp + " ℉";
    // windList.textContent = "Wind: " + wind + " MPH";
    // humidityList.textContent = "Humidity: " + humidity + " %";

    // dailyDiv[i].appendChild(futureDate);
    // dailyDiv[i].appendChild(img);
    // dailyDiv[i].appendChild(ul);
    // ul.appendChild(tempList);
    // ul.appendChild(windList);
    // ul.appendChild(humidityList);
  }
}
function getIcons(icon) {
  var iconUrl = "https://openweathermap.org/img/w/" + icon + ".png";
  return iconUrl;
}
//creates element and appends town name of zipcode
function zipCodeTown(name) {
  console.log(name);
}


mainForm.addEventListener("submit", getLonLat);
