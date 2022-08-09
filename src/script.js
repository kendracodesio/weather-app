let defaultCity = "Los Angeles";
requestApiDatabyCity(defaultCity);

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
  let LocalDateTime = document.querySelector("#local-date-time");
  LocalDateTime.innerHTML = getTime(timezone / 3600);

  let cityDisplay = document.querySelector("#city-display");
  let countryDisplay = document.querySelector("#country-display");
  let currentTempDisplay = document.querySelector("#todays-temp");
  let feelsLikeDisplay = document.querySelector("#feels-like");
  let humidityDisplay = document.querySelector("#humidity");
  let windSpeedDisplay = document.querySelector("#windSpeed");
  let currentConditionsDisplay = document.querySelector("#current-conditions");
  let mainWeatherIcon = document.querySelector("#main-weather-icon");

  cityDisplay.innerHTML = response.data.name;
  countryDisplay.innerHTML = response.data.sys.country;
  currentTempDisplay.innerHTML = Math.round(response.data.main.temp);
  feelsLikeDisplay.innerHTML = Math.round(response.data.main.feels_like);
  humidityDisplay.innerHTML = response.data.main.humidity;
  windSpeedDisplay.innerHTML = Math.round(response.data.wind.speed);
  currentConditionsDisplay.innerHTML = response.data.weather[0].description;
  mainWeatherIcon.setAttribute(
    "src",
    ` http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  mainWeatherIcon.setAttribute("alt", response.data.weather[0].description);
}

function requestApiDatabyCity(cityName) {
  let apiKey = "1e443f6da9b633764beaeb76bb472402";
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showApiData);
}
function requestApiData(event) {
  event.preventDefault();
  let citySearch = document.querySelector("#city-search");
  let cityName = `${citySearch.value}`;
  requestApiDatabyCity(cityName);
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

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", requestApiData);

let currentLocationButton = document.querySelector("#get-location-button");
currentLocationButton.addEventListener("click", getLocation);

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

let buttonF = document.querySelector("#unit-f");
let buttonC = document.querySelector("#unit-c");

buttonF.addEventListener("click", displayF);
buttonC.addEventListener("click", displayC);
