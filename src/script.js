function convertTimeAmPm(hours, minutes) {
    let amOrPm = "";
  if (hours >= 12) {
    amOrPm = "PM";
  } else {
    amOrPm = "AM";
  };
  hours = ((hours + 11) % 12) + 1;
  if(minutes < 10) {
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

let currentDate = document.querySelector("#current-date");

currentDate.innerHTML = formatDate(new Date());

function showApiData(response) {
  console.log(response);
  let city = response.data.name;
  let country = response.data.sys.country;
  let currentTemp = Math.round(response.data.main.temp);
  let feelsLikeTemp = Math.round(response.data.main.feels_like);
  let humidity = response.data.main.humidity;
  let windSpeed = Math.round(response.data.wind.speed);
  let currentConditions = response.data.weather[0].description;
  let cityDisplay = document.querySelector("#city-display");
  let countryDisplay = document.querySelector("#country-display");
  let currentTempDisplay = document.querySelector("#todays-temp");
  let feelsLikeDisplay = document.querySelector("#feels-like");
  let humidityDisplay = document.querySelector("#humidity");
  let windSpeedDisplay = document.querySelector("#windSpeed");
  let currentConditionsDisplay = document.querySelector("#current-conditions");
  cityDisplay.innerHTML = city;
  countryDisplay.innerHTML = country;
  currentTempDisplay.innerHTML = currentTemp;
  feelsLikeDisplay.innerHTML = feelsLikeTemp;
  humidityDisplay.innerHTML = humidity;
  windSpeedDisplay.innerHTML = windSpeed;
  currentConditionsDisplay.innerHTML = currentConditions;
 
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

let defaultCity = "Los Angeles"
requestApiDatabyCity(defaultCity);

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

function displayF(){
    if (buttonC.innerHTML === `<strong>C</strong>`) {
        let todaysTemp = document.querySelector("#todays-temp");
        let todaysFahrenheitTemp = celsiusToFahrenheit(todaysTemp.innerHTML);
        todaysTemp.innerHTML = Math.round(todaysFahrenheitTemp);
        buttonF.innerHTML = `<strong>F</strong>`;
        buttonC.innerHTML = "C";  

    } 
}

function displayC(){
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