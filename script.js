function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
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

  return `${day} ${hours}:${minutes}`;
}

let dateElement = document.querySelector("#date");
let currentTime = new Date();

dateElement.innerHTML = formatDate(currentTime);

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
}

function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  console.log(response);
  let temperatureElement = document.querySelector("#tempNow");
  let descriptionElement = document.querySelector(".weather");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let pressureElement = document.querySelector("#pressure");
  let feelslikeElement = document.querySelector("#feelsLike");
  temperatureElement.innerHTML = `${temperature}°`;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  pressureElement.innerHTML = response.data.main.pressure;
  feelslikeElement.innerHTML = response.data.main.feels_like;
}
