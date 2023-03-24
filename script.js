document.addEventListener("DOMContentLoaded", function() {
  const HISTORY_LIMIT = 9;
  populateSearchHistory();

  document.querySelector("#search-button").addEventListener("click", function(event) {
    event.preventDefault();
    var cityName = document.querySelector("#search-input").value.trim();
    if (cityName !== "") {
      displayCityWeather(cityName);
      if (!isCityInHistory(cityName)) {
        storeCityToLocalStorage(cityName);
        populateSearchHistory();
      }
    }
  });

  function isCityInHistory(cityName) {
    cities = getCitiesArrayFromLocalStorage();
    for (let i = 0; i < HISTORY_LIMIT; i++) {
      if (cities[i] === cityName) {
        return true;
      }
    }
    return false;
  }

  function getCitiesArrayFromLocalStorage() {
    var cities = localStorage.getItem("cities");
    if (cities === null) {
      localStorage.setItem("cities", JSON.stringify([]));
    }
    return JSON.parse(localStorage.getItem("cities"));
  }

  function storeCityToLocalStorage(cityName) {
    var cities = getCitiesArrayFromLocalStorage();
    cities.unshift(cityName);
    localStorage.setItem("cities", JSON.stringify(cities));
  }

  function populateSearchHistory() {
    var $history = document.querySelector("#history");
    $history.innerHTML = "";
    var citiesSearchHistory = getCitiesArrayFromLocalStorage();
    for (let i = 0; i < citiesSearchHistory.length; i++) {
      if (i + 1 <= 9) {
        var button = createSearchHistoryBtn(citiesSearchHistory[i]);
        $history.appendChild(button);
      }
    }
  }

  function createSearchHistoryBtn(city) {
    var buttonEl = document.createElement("button");
    buttonEl.classList.add("btn", "btn-secondary", "search-button", "btn-block", "text-capitalize");
    buttonEl.textContent = city;
    buttonEl.style.color = "black";
    buttonEl.addEventListener("click", function() {
      displayCityWeather(city);
    });
    return buttonEl;
  }

  function displayCityWeather(cityName) {
    var APIkey = '52d558d3ab565a0485f70b38fab6c332'
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIkey;

    fetch(queryURL)
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        displayCityCurrentWeather(cityName, response);
        return { lon: response.coord.lon, lat: response.coord.lat }
      })
      .then(function({ lon, lat }) {
        var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`;

        fetch(queryURL)
          .then(function(response) {
            return response.json();
          })
          .then(function(response) {
            displayFiveDayForecast(response);
          });
      });
  }

  function displayCityCurrentWeather(cityName, data) {
    var $today = document.querySelector("#today");
    $today.innerHTML = "";
    $today.appendChild(createCurrentWeatherCard(cityName, data));
  }

  function displayFiveDayForecast(data) {
    var $forecast = document.querySelector("#forecast");
    $forecast.innerHTML = "";
    document.querySelector("#forecast-title").classList.remove("invisible");

    for (var i = 7; i < data.cnt; i += 8) {
      $forecast.appendChild(createForecastCard(data.list[i]));
    }
  }

  function createCurrentWeatherCard(cityName, weatherData) {
    var cardEl = document.createElement("div");
    cardEl.classList.add("card", "mr-2");
    cardEl.style.width = "62rem";
    var cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    function createTitleElement(cityName, weatherData) {
      var titleEl = document.createElement("h3");
      titleEl.classList.add("card-title");
      titleEl.textContent = cityName + " (" + moment().format("M/D/YYYY") + ") ";
      var iconEl = document.createElement("img");
      iconEl.src = getWeatherIconURL(weatherData.weather[0].icon);
      titleEl.appendChild(iconEl);
      return titleEl;
    }
    

    var titleEl = createTitleElement(cityName, weatherData);
    var { tempEl, windEl, humidityEl } = createWeatherStatsElements(weatherData);

    cardBody.appendChild(titleEl);
    cardBody.appendChild(tempEl);
    cardBody.appendChild(windEl);
    cardBody.appendChild(humidityEl);
    cardEl.appendChild(cardBody);

    return cardEl;
  }

  function createForecastCard(weatherData) {
    var date = formatDate(weatherData.dt);
    var iconURL = getWeatherIconURL(weatherData.weather[0].icon);

    var cardEl = document.createElement("div");
    cardEl.classList.add("card", "mr-2");
    cardEl.style.width = "12rem";
    var cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    cardBody.style.color = "white";
    cardBody.style.backgroundColor = "#001A53";

    var dateEl = document.createElement("h5");
    dateEl.classList.add("card-title");
    dateEl.textContent = date;

    var iconEl = document.createElement("img");
    iconEl.src = iconURL;

    var { tempEl, windEl, humidityEl } = createWeatherStatsElements(weatherData);

    cardBody.appendChild(dateEl);
    cardBody.appendChild(iconEl);
    cardBody.appendChild(tempEl);
    cardBody.appendChild(windEl);
    cardBody.appendChild(humidityEl);
    cardEl.appendChild(cardBody);

    return cardEl;
  }

  function createWeatherStatsElements(weatherData) {
    var tempCelsius = convertTempToCelsius(weatherData.main.temp);
    var humidity = weatherData.main.humidity;
    var windSpeedKPH = convertWindSpeedToKPH(weatherData.wind.speed);

    var tempEl = document.createElement("p");
    tempEl.classList.add("card-text");
    tempEl.textContent = "Temp: " + tempCelsius + " °C";

    var windEl = document.createElement("p");
    windEl.classList.add("card-text");
    windEl.textContent = "Wind: " + windSpeedKPH + " KPH";

    var humidityEl = document.createElement("p");
    humidityEl.classList.add("card-text");
    humidityEl.textContent = "Humidity: " + humidity + "%";

    return {
      tempEl: tempEl,
      windEl: windEl,
      humidityEl: humidityEl,
    };
  }

  function formatDate(unixTime) {
    return moment.unix(unixTime).format("DD/M/YYYY");
  }

  function getWeatherIconURL(iconText) {
    return "https://openweathermap.org/img/w/" + iconText + ".png";
  }

  function convertWindSpeedToKPH(speed) {
    return (speed * 3.6).toFixed(2);
  }

  function convertTempToCelsius(tempKelvin) {
    return (tempKelvin - 273.15).toFixed(2);
  }
});
