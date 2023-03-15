// Get references to the HTML elements
const searchFormEl = document.querySelector("#search-form");
const searchInputEl = document.querySelector("#search-input");
const historyEl = document.querySelector("#history");
const todayEl = document.querySelector("#today");
const forecastEl = document.querySelector("#forecast");

// Initialize the search history array
let searchHistory = [];

// Function to handle the form submission
function handleFormSubmit(event) {
  event.preventDefault();

  // Get the search input value
  const searchInput = searchInputEl.value.trim();

  if (searchInput !== "") {
    // Call the API to get the weather data
    getWeatherData(searchInput);
    // Add the search term to the search history
    addToSearchHistory(searchInput);
    // Clear the search input
    searchInputEl.value = "";
  }
}

// Function to get the weather data for a given city
function getWeatherData(city) {
  // Construct the API URL using the city name and API key
  const apiKey = "6cd376d08d644ada8e8120127231503";
  const currentWeatherApiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
  const forecastApiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;

  // Call the API to get the current weather data for the city
  fetch(currentWeatherApiUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // Use the retrieved data to update the UI with current weather info
      console.log(data);
    });

  // Call the API to get the 5-day forecast for the city
  fetch(forecastApiUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // Use the retrieved data to update the UI with 5-day forecast info
      console.log(data);
    });
}

// Function to add a search term to the search history
function addToSearchHistory(searchTerm) {
  // Add the search term to the search history array
  searchHistory.push(searchTerm);

  // Add the search term to the search history element
  const listItemEl = document.createElement("li");
  listItemEl.textContent = searchTerm;
  historyEl.appendChild(listItemEl);
}

// Add event listener to the form element
searchFormEl.addEventListener("submit", handleFormSubmit);

