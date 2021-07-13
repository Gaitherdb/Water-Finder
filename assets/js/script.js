const APIKey = "92421b7f2bf12b73f6e7c38295c935c0";


function searchApi5DayForecast(currentData) {
 
  // var queryURL = "api.openweathermap.org/data/2.5/forecast?zip=" + {zip code},{country code} + "&appid=" + APIKey;

  fetch(queryURL)
      .then(function (response) {
          if (response.ok) {
              response.json().then(function (data) {
                  console.log(data);
              })
          } else {
              alert('Error: ' + response.statusText)
          }
      })
      .catch(function (error) {
          alert('Unable to connect to OpenWeatherMap.com');
      })
}





document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var options = "";
    var instances = M.FormSelect.init(elems, options);
  });