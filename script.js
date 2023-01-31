// Select elements from HTML
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('.weather-search');
const todaySection = document.querySelector('#today');
const forecastSection = document.querySelector('#forecast');
const searchHistory = document.querySelector('.search-history');

// API endpoint
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=`;
const apiKey = `&appid=b2bbb7276d8739c63b0ae6a20dea7e17`;

// Search for city weather information
searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const city = searchInput.value;
  searchInput.value = '';

  // Get current weather information
  fetch(`${apiUrl}${city}${apiKey}`)
    .then(res => res.json())
    .then(data => {
      // Update today section
      todaySection.innerHTML = `
        <h2>${data.name} (${formatDate(data.dt * 1000)})</h2>
        <div class="card-body">
          <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
          <div class="card-text">
            <p>Temperature: ${data.main.temp} &#8457;</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} mph</p>
          </div>
        </div>
      `;

      // Get 5-day forecast information
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}${apiKey}`)
        .then(res => res.json())
        .then(data => {
          // Clear previous forecast information
          forecastSection.innerHTML = '';

          // Loop through 5-day forecast
          for (let i = 0; i < data.list.length; i += 8) {
            const forecast = data.list[i];
            const date = formatDate(forecast.dt * 1000);

            // Update forecast section
            forecastSection.innerHTML += `
              <div class="card">
                <p>${date}</p>
                <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="Weather icon">
                <p>Temperature: ${forecast.main.temp} &#8457;</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
              </div>
            `;
          }
        });

      // Add city to search history
      searchHistory.innerHTML += `<li>${city}</li>`;
    });
});

// Format date
function formatDate(date) {
  const d = new Date(date);
  const year = d.


  