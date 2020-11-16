function formatDate(timestamp) {
  let date = new Date(timestamp);
  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[dayIndex];

  let year = date.getFullYear();
  let today = date.getDate();

  let monthIndex = date.getMonth();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[monthIndex];

  return `${month} ${today}, ${year} </br>  <span id="pst">as of </span> ${formatHours(
    timestamp
  )}
  PST </br><span id="refresh">(Refresh for update)</span>`;
}

let dateElement = document.querySelector("#date");
let currentTime = new Date();

dateElement.innerHTML = formatDate(currentTime);

function formatHours(timestamp) {
  let date = new Date(timestamp);

  return `${date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  })}`;
}

function search(event) {
  event.preventDefault();
  let inputCity = document.querySelector("#response");
  let currentCity = document.querySelector(".city");

  currentCity.innerHTML = inputCity.value;

  searchCity(inputCity.value);
}

let searchingNow = document.querySelector("#searching");
searchingNow.addEventListener("submit", search);

function searchCity(city) {
  let key = "c2a0308255fedbe7dd192fcd88e7b405";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=imperial`;
  axios.get(`${apiUrl}&appid=${key}`).then(showTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

function searchLocation(position) {
  let key = "c2a0308255fedbe7dd192fcd88e7b405";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${key}&units=imperial`;
  axios.get(url).then(showTemperature);
  url = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${key}&units=imperial`;
  axios.get(url).then(displayForecast);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#tempNow");
  let descriptionElement = document.querySelector(".weather");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let pressureElement = document.querySelector("#pressure");
  let feelslikeElement = document.querySelector("#feelsLike");
  let iconElement = document.querySelector("#icon");

  fahrenheitTemperature = response.data.main.temp;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature) + "°F";

  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  pressureElement.innerHTML =
    Math.round((response.data.main.pressure / 33.863886666667) * 100) / 100;
  feelslikeElement.innerHTML = Math.round(response.data.main.feels_like) + "°F";
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  let currentCity = document.querySelector(".city");
  currentCity.innerHTML = response.data.name;
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += ` 
  
                <div class="col-6 col-md-2 text-center mb-4 mb-md-0">
                   <h3>
                  ${formatHours(forecast.dt * 1000)}
                   </h3>
                        <img src="http://openweathermap.org/img/wn/${
                          forecast.weather[0].icon
                        }@2x.png"/> 

                        <div class="weather-forecast-temperature"><strong><span class="forecast-max">${Math.round(
                          forecast.main.temp_max
                        )}</span>° </strong><span class="forecast-min">${Math.round(
      forecast.main.temp_min
    )}</span>°
                   
                    </div>
                </div> `;
  }
}

let currentLocationButton = document.querySelector(".current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let fahrenheitClickButton = document.querySelector("#fahrenheitButton");

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#tempNow");

  temperatureElement.innerHTML = Math.round(fahrenheitTemperature) + "°F";

  let forecastMax = document.querySelectorAll(".forecast-max");
  forecastMax.forEach(function (item) {
    let currentTemp = item.innerHTML;

    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  let forecastMin = document.querySelectorAll(".forecast-min");
  forecastMin.forEach(function (item) {
    let currentTemp = item.innerHTML;

    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  celsiusClickButton.addEventListener("click", displayCelsiusTemp);
  fahrenheitClickButton.removeEventListener("click", displayFahrenheitTemp);
}

function displayCelsiusTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#tempNow");
  let celsiusTemperature = (fahrenheitTemperature - 30) / 2;
  temperatureElement.innerHTML = Math.round(celsiusTemperature) + "°C";

  let forecastMax = document.querySelectorAll(".forecast-max");
  forecastMax.forEach(function (item) {
    let currentTemp = item.innerHTML;

    item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });

  let forecastMin = document.querySelectorAll(".forecast-min");
  forecastMin.forEach(function (item) {
    let currentTemp = item.innerHTML;

    item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });

  celsiusClickButton.removeEventListener("click", displayCelsiusTemp);
  fahrenheitClickButton.addEventListener("click", displayFahrenheitTemp);
}

let fahrenheitTemperature = null;

let celsiusClickButton = document.querySelector("#celsiusButton");
celsiusClickButton.addEventListener("click", displayCelsiusTemp);

searchCity("Los Angeles");
