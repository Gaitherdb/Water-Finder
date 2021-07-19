var submitBtn = document.getElementById("submitbtn");
var mainForm = document.getElementById("mainform");
var results = document.querySelector(".results");
var searchHistory = document.querySelectorAll(".searchHistory");
var searchHistoryContainer = document.querySelector("#asideStyle");

const APIKey = "92421b7f2bf12b73f6e7c38295c935c0";
var DateTime = luxon.DateTime;
var dontStealThis = "AIzaSyC7BB3RT0eLCTCmv67coQEu9B7HT5YnnD4";
var q;
var savedZipCode = [];

//Event listener for distance select
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('select');
  var options = "";
  var instances = M.FormSelect.init(elems, options);
});
//loads saved search history
renderLocalStorage();
//if user clicks on a saved zipcode, it'll run the app with that zipcode + default 50 mi radius
searchHistoryContainer.addEventListener("click", function (event) {
  var element = event.target;
  //if you click a saved search history btn
  if (element.matches(".searchHistory")) {
    //then run function to get data and render results without saving the zipcode again
    savedHistoryLonLat(element.textContent);
  }
})
//uses saved zipcode and default 50 mi radius to search without saving zipcode again
function savedHistoryLonLat(zipCode) {
  q = 0;
  results.textContent = " ";

  var queryURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + zipCode + ",US&units=imperial&appid=" + APIKey;

  fetch(queryURL)
    .then(function (response) {
      response.json().then(function (data) {
        lonLat = data.coord.lat + "," + data.coord.lon;
        savedHistoryGoogleFunction(lonLat);
      });
    })
}
//just like other google search function but has default distance
var savedHistoryGoogleFunction = function (lonLat) {
  var defaultDistance = 80467;

  let apiAddress =
    "https://cors-anywhere.herokuapp.com/" + "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
    lonLat +
    "&radius=" +
    defaultDistance +
    "&type=campground&keyword=cruise&key=" +
    dontStealThis;

  fetch(apiAddress)
    .then(function (response) {
      response.json()
        .then(function (data) {
          console.log(data);
          campgroundResults(data);
        }) 
    })
}

//gets coordinates of inital zipcode input
function getLonLat(event) {
  event.preventDefault();
  q = 0;
  results.textContent = " ";
  var locationInput = document.getElementById("location");
  var locationInput = locationInput.value;
  var distanceBtn = document.querySelector("#distance");
  var opt = distanceBtn.options[distanceBtn.selectedIndex];
  if (opt.value === "" || locationInput === "") {
    modal.style.display = "block";
    return
  }
  //passes searched zipcode to local storage
  addLocalStorage(locationInput);
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
//global variables and clicks for the modal alert

var modal = document.getElementById("myModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
//searches campgrounds within selected distance radius of input zipcode
var searchFunction = function (lonLat) {
  var distanceInput = document.getElementById("distance");
  var distanceInput = distanceInput.value;

  let apiAddress =
    "https://cors-anywhere.herokuapp.com/" + "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
    lonLat +
    "&radius=" +
    distanceInput +
    "&type=campground&keyword=cruise&key=" +
    dontStealThis;

  fetch(apiAddress)
    .then(function (response) {
      response.json()
        .then(function (data) {
          campgroundResults(data);
        })
    })
}
function addLocalStorage(zipCode) {
  //adds new zipcode to the array of saved searches
  savedZipCode.push(zipCode);
  //keeps saved zip at a max of 3
  if (savedZipCode.length > 3) {
    savedZipCode.splice(0, 1);
  }
  //saves array of up to 3 zipcodes to local storage
  localStorage.setItem("searchHistory", JSON.stringify(savedZipCode));
  renderLocalStorage();
}
//renders buttons based on previous searches when you open the page
function renderLocalStorage() {
 var savedSH = localStorage.getItem("searchHistory");
  if (savedSH) {
    savedZipCode = JSON.parse(savedSH);
    for (i = 0; i < savedZipCode.length; i++) {
      searchHistory[i].textContent = savedZipCode[i];
    }
  }
}

function campgroundResults(data) {
  //gets up to 5 results of campgrounds
  var campgrounds = data.results.slice(0, 5);
  for (i = 0; i < campgrounds.length; i++) {
    var div = document.createElement("div");
    div.classList.add("campground");
    var h4 = document.createElement("h4");
    h4.classList.add("inline");
    var h4Div = document.createElement("div");
    h4Div.classList.add("inline");

    var coord = campgrounds[i].geometry.location;
    var name = campgrounds[i].name;
    var address = campgrounds[i].vicinity;

    h4.textContent = name;
    h4Div.textContent = address;

    results.appendChild(div);
    div.appendChild(h4);
    div.appendChild(h4Div);
    var campgroundDiv = document.querySelectorAll(".campground");
    var forecast = document.createElement("div");
    forecast.classList.add("forecast");
    campgroundDiv[i].appendChild(forecast);
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
  console.log(data);
  var local = DateTime.local();
  var rezoned = local.setZone(data.timezone);
  //forecast div contains current day + 5 day forecast for each campground
  var dailyForecast = document.querySelectorAll(".forecast");
  //parses and appends weather for current day + 5 future days
  for (i = 0; i < 6; i++) {
    var div = document.createElement("div");
    div.classList.add("dailyDiv");
    dailyForecast[q].appendChild(div);
    //calculates date from zipcode and displays nicely for each future date
    var addDay = rezoned.plus({ days: (i - 1) + 1 })
    var newDate = addDay.toFormat("ccc LLL d");
    //parses out weather data
    var dailyWeatherDesc = data.daily[i].weather[0].description;
    var icon = getIcons(data.daily[i].weather[0].icon);
    var temp = data.daily[i].temp.max.toFixed(2);
    var wind = data.daily[i].wind_speed.toFixed(2);
    var humidity = data.daily[i].humidity;

    var date = document.createElement("h5");
    date.classList.add('dailyDate');
    date.textContent = newDate;
    var img = document.createElement("img");
    img.src = icon;
    img.alt = "Weather Icon";

    var ul = document.createElement("ul");
    var description = document.createElement("li");
    var tempList = document.createElement("li");
    var windList = document.createElement("li");
    var humidityList = document.createElement("li");
    description.textContent = dailyWeatherDesc;
    tempList.textContent = "Temp: " + temp + " ℉";
    windList.textContent = "Wind: " + wind + " MPH";
    humidityList.textContent = "Humidity: " + humidity + " %";

    div.appendChild(date);
    div.appendChild(img);
    div.appendChild(ul);
    ul.appendChild(description);
    ul.appendChild(tempList);
    ul.appendChild(windList);
    ul.appendChild(humidityList);
  }
  //q = counter for how many forecast classes are made aka how many campgrounds found (5 or less)
  q++;
}

function getIcons(icon) {
  var iconUrl = "https://openweathermap.org/img/w/" + icon + ".png";
  return iconUrl;
}

mainForm.addEventListener("submit", getLonLat);
