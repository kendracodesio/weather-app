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
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
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
  let citysLocalTime = new Date(utc + 3600000 * timezone);
  return formatDate(citysLocalTime);
}

function getDay(timestamp) {
let date = new Date(timestamp * 1000);
  let days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];
return days[date.getDay()];
}

function getApiDataByCity(cityName) {
  let apiKey = "1e443f6da9b633764beaeb76bb472402";
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showApiData);
}

let defaultCity = "Los Angeles";
getApiDataByCity(defaultCity);

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

function getCurrentLocationCoordsForApi(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "1e443f6da9b633764beaeb76bb472402";
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showApiData);
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(getCurrentLocationCoordsForApi);
}

function displayForecast(response) {
  console.log(response.data.daily);
  let forecast = response.data.daily;

 
  let todaysHighElement = document.querySelector("#hi-temp-today");
  let todayLowElement = document.querySelector("#lo-temp-today");
  let forecastElement = document.querySelector("#five-day-forecast");
  let forecastHTML = `<div class="row">`;
  let count = 0;
  let startIndex = 0;
  let found = false;

  forecast.forEach(function(forecastDay, index) {
    if (index === 0 || index === 1) {
      let localDateTimeElement = document.querySelector("#local-date-time");
      if(localDateTimeElement.innerHTML.includes(getDay(forecastDay.dt))) {
        startIndex = index + 1;
        found = true;
        todaysHighElement.innerHTML = Math.round(forecastDay.temp.max);
        todayLowElement.innerHTML = Math.round(forecastDay.temp.min);
      }
    }
    if (found) {
    if ((index >= startIndex) && (index < (5 + startIndex))) {
     
    forecastHTML += `<div class="col">
                    <h5 class="forecast-title-day">
                      ${getDay(forecastDay.dt)}
                    </h5>
                    <img src="http://openweathermap.org/img/wn/${
                      forecastDay.weather[0].icon}@2x.png" alt="${forecastDay.weather[0].description}" class="forecast-day-icon" />
                    <div class="forecast-temps-day">
                      <div class="hi-temp-day">
                        ${Math.round(forecastDay.temp.max)}°
                      </div>
                      <div class="low-temp-day">
                        ${Math.round(forecastDay.temp.min)}°
                      </div>
                    </div>
                </div>`;
       }
    }
  });


  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}



function showApiData(response) {
  console.log(response);
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  let apiKey = "1e443f6da9b633764beaeb76bb472402";
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
  let timezone = response.data.timezone;
  let LocalDateTimeElement = document.querySelector("#local-date-time");
  LocalDateTimeElement.innerHTML = getTime(timezone / 3600);
  let cityElement = document.querySelector("#city-display");
  let countryElement = document.querySelector("#country-display");
  let currentTempElement = document.querySelector("#todays-temp");
  let hiTempTodayElement = document.querySelector("#hi-temp-today");
  let loTempTodayElement = document.querySelector("#lo-temp-today");
  let feelsLikeElement = document.querySelector("#feels-like");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#windSpeed");
  let currentConditionsElement = document.querySelector("#current-conditions");
  let mainWeatherIcon = document.querySelector("#main-weather-icon");
  cityElement.innerHTML = response.data.name;
  countryElement.innerHTML = response.data.sys.country;
  currentTempElement.innerHTML = Math.round(response.data.main.temp);
  hiTempTodayElement.innerHTML = Math.round(response.data.main.temp_max);
  loTempTodayElement.innerHTML = Math.round(response.data.main.temp_min);
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);
  humidityElement.innerHTML = response.data.main.humidity;
  windSpeedElement.innerHTML = Math.round(response.data.wind.speed);
  currentConditionsElement.innerHTML = response.data.weather[0].description;
  mainWeatherIcon.setAttribute(
    "src",
    ` http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  mainWeatherIcon.setAttribute("alt", response.data.weather[0].description);
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

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", requestApiData);

let currentLocationButton = document.querySelector("#get-location-button");
currentLocationButton.addEventListener("click", getLocation);

let buttonF = document.querySelector("#unit-f");
let buttonC = document.querySelector("#unit-c");

buttonF.addEventListener("click", displayF);
buttonC.addEventListener("click", displayC);
