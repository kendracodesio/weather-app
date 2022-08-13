
function convertTimeAmPm(hours, minutes) {
  let amOrPm = "";
  if (hours >= 12) {
    amOrPm = "PM";
  } else {
    amOrPm = "AM";
  }
  hours = ((hours + 11) % 12) + 1;
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes} ${amOrPm}`;
}

function formatDate(newDate) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[newDate.getDay()];

  let hr = newDate.getHours();
  let min = newDate.getMinutes();
  let time = convertTimeAmPm(hr, min);
  return `${day} ${time}`;
}

function getTime(timezone) {
  let date = new Date();
  let usersLocalTime = date.getTime();
  let currentOffset = date.getTimezoneOffset() * 60000;
  let utc = usersLocalTime + currentOffset;
  let citysLocalTime = new Date(utc + (3600000 * timezone));
  return formatDate(citysLocalTime);
}

function showApiData(response) {
  console.log(response);
  let timezone = response.data.timezone;
  let LocalDateTimeElement = document.querySelector("#local-date-time");
  LocalDateTimeElement.innerHTML = getTime(timezone / 3600);
  let cityElement = document.querySelector("#city-display");
  let countryElement = document.querySelector("#country-display");
  let currentTempElement = document.querySelector("#todays-temp");
  let feelsLikeElement = document.querySelector("#feels-like");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#windSpeed");
  let currentConditionsElement = document.querySelector("#current-conditions");
  let mainWeatherIcon = document.querySelector("#main-weather-icon");
  cityElement.innerHTML = response.data.name;
  countryElement.innerHTML = response.data.sys.country;
  currentTempElement.innerHTML = Math.round(response.data.main.temp);
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);
  humidityElement.innerHTML = response.data.main.humidity;
  windSpeedElement.innerHTML = Math.round(response.data.wind.speed);
  currentConditionsElement.innerHTML = response.data.weather[0].description;
  mainWeatherIcon.setAttribute(
    "src",
    ` http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  mainWeatherIcon.setAttribute("alt", response.data.weather[0].description);
  displayForecast();
}

function getApiDataByCity(cityName) {
  let apiKey = "1e443f6da9b633764beaeb76bb472402";
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showApiData);
}

//works for 2 letter US state or spelled out country
function getApiDataByCityStateCountry(cityName, stateAbbrOrCountry) {
  let apiKey = "1e443f6da9b633764beaeb76bb472402";
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${stateAbbrOrCountry},US&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showApiData);
}

function requestApiData(event) {
  event.preventDefault();
  let citySearchElement = document.querySelector("#city-search");
  let cityName = `${citySearchElement.value}`;
  if (cityName.includes(",")) {
    let cityArray = cityName.split(",");
    getApiDataByCityStateCountry(cityArray[0], cityArray[1]);
  } else {
     getApiDataByCity(cityName);
  }
}

function getCoordsForApi(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "1e443f6da9b633764beaeb76bb472402";
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showApiData);
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(getCoordsForApi);
}


function celsiusToFahrenheit(celsiusTemp) {
  let fahrenheitTemp = celsiusTemp * (9 / 5) + 32;
  return fahrenheitTemp;
}

function fahrenheitToCelsius(fahrenheitTemp) {
  let celsiusTemp = (fahrenheitTemp - 32) / (9 / 5);
  return celsiusTemp;
}

function displayF() {
  if (buttonC.innerHTML === `<strong>C</strong>`) {
    let todaysTemp = document.querySelector("#todays-temp");
    let todaysFahrenheitTemp = celsiusToFahrenheit(todaysTemp.innerHTML);
    todaysTemp.innerHTML = Math.round(todaysFahrenheitTemp);
    buttonF.innerHTML = `<strong>F</strong>`;
    buttonC.innerHTML = "C";
  }
}

function displayC() {
  if (buttonF.innerHTML === `<strong>F</strong>`) {
    let todaysTemp = document.querySelector("#todays-temp");
    let todaysCelsiusTemp = fahrenheitToCelsius(todaysTemp.innerHTML);
    todaysTemp.innerHTML = Math.round(todaysCelsiusTemp);
    buttonC.innerHTML = `<strong>C</strong>`;
    buttonF.innerHTML = "F";
  }
}


function displayForecast() {
let forecastElement = document.querySelector("#five-day-forecast");
let forecastDays = ["Sun", "Mon", "Tue", "Wed", "Thu"];
let forecastHTML = `<div class="row">`;
forecastDays.forEach(function(day) {
  forecastHTML = forecastHTML + 
              `<div class="col">
                    <h5 class="forecast-title-day">
                      ${day}
                    </h5>
                    <img src="http://openweathermap.org/img/wn/02d@2x.png" alt="" class="forecast-day-icon" />
                    <div class="forecast-temps-day">
                      <div class="hi-temp-day">
                        90°
                      </div>
                      <div class="low-temp-day">
                        65°
                      </div>
                    </div>
                </div>`;
});
forecastHTML = forecastHTML + `</div>`;
forecastElement.innerHTML = forecastHTML;
}


let defaultCity = "Los Angeles";
getApiDataByCity(defaultCity);


let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", requestApiData);

let currentLocationButton = document.querySelector("#get-location-button");
currentLocationButton.addEventListener("click", getLocation);

let buttonF = document.querySelector("#unit-f");
let buttonC = document.querySelector("#unit-c");

buttonF.addEventListener("click", displayF);
buttonC.addEventListener("click", displayC);

