const apiKey = 'b9c8aac403f16628beacd26b45cd892c';
const body = document.getElementById('body');

// Initialize app, the basic layout is from CodeNepal
document.addEventListener("DOMContentLoaded", function () {
    renderFavoriteCities();
    applySavedDarkMode();
});

// Fetch current weather, from CodeNepal
async function getWeather() {
    const city = document.getElementById('city-input').value || 'Stockholm';
    const unit = document.getElementById('temp-unit').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
            displayWeather(data, unit);
            changeThemeBasedOnWeather(data.weather[0].main);
        } else {
            alert('City not found.');
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
}
async function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const unit = document.getElementById('temp-unit').value;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                if (response.ok) {
                    displayWeather(data, unit);
                    changeThemeBasedOnWeather(data.weather[0].main);
                } else {
                    alert('Unable to fetch weather for your location.');
                }
            } catch (error) {
                console.error('Error fetching location weather:', error);
            }
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

// Display current weather, From StackOverflow
function displayWeather(data, unit) {
    const tempUnitSymbol = unit === 'metric' ? '°C' : unit === 'imperial' ? '°F' : 'K';
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('date').textContent = new Date().toLocaleString();
    document.getElementById('temperature').textContent = `${data.main.temp} ${tempUnitSymbol}`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('wind-speed').textContent = `Wind: ${data.wind.speed} m/s`;
    document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}

// Fetch and display 24-hour forecast
async function get24HourForecast() {
    const city = document.getElementById('city-input').value || 'Stockholm';
    const unit = document.getElementById('temp-unit').value;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
            display24HourForecast(data.list.slice(0, 8), unit);
        } else {
            alert('Error fetching forecast.');
        }
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

function display24HourForecast(forecast, unit) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    forecast.forEach(hourData => {
        const hourElem = document.createElement('div');
        const time = new Date(hourData.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const tempUnitSymbol = unit === 'metric' ? '°C' : unit === 'imperial' ? '°F' : 'K';
        hourElem.innerHTML = `
            <p>${time} - ${hourData.main.temp} ${tempUnitSymbol}, ${hourData.weather[0].description}</p>
            <img src="http://openweathermap.org/img/wn/${hourData.weather[0].icon}.png" alt="Icon">
        `;
        forecastDiv.appendChild(hourElem);
    });

    document.getElementById('forecast-info').style.display = 'block';
}
//got help from chatgpt
const weatherAPIKey = "d3514b1a8c3b4a57843231850241611"; 

async function getSevenDayForecast() {
    const city = document.getElementById("city-input").value || "Stockholm";
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${weatherAPIKey}&q=${city}&days=7`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            displaySevenDayForecast(data.forecast.forecastday);
        } else {
            alert(`Error fetching 7-day forecast: ${data.error.message}`);
        }
    } catch (error) {
        console.error("Error fetching 7-day forecast:", error);
    }
}
const API = "d3514b1a8c3b4a57843231850241611"
function displaySevenDayForecast(forecastDays) {
    const forecastContainer = document.getElementById("seven-day-forecast");
    forecastContainer.innerHTML = "";

    forecastDays.forEach(day => {
        const dayElement = document.createElement("div");
        dayElement.classList.add("forecast-day");

        const date = new Date(day.date).toLocaleDateString(undefined, {
            weekday: "long",
            day: "numeric",
            month: "short",
        });

        dayElement.innerHTML = `
            <p><strong>${date}</strong></p>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p>${day.day.condition.text}</p>
            <p>Max: ${day.day.maxtemp_c}°C</p>
            <p>Min: ${day.day.mintemp_c}°C</p>
        `;

        forecastContainer.appendChild(dayElement);
    });

    document.getElementById("seven-day-forecast-info").style.display = "block";
}
//got help from chatgpt
function display7DayForecast(data) {
    const forecastDiv = document.getElementById('7-day-forecast');
    forecastDiv.innerHTML = '';

    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date).toLocaleDateString();
        const iconUrl = `https:${day.day.condition.icon}`;

        const dayElem = document.createElement('div');
        dayElem.classList.add('forecast-day');
        dayElem.innerHTML = `
            <p>${date}</p>
            <img src="${iconUrl}" alt="${day.day.condition.text}" class="forecast-icon">
            <p>${day.day.condition.text}</p>
            <p>Max Temp: ${day.day.maxtemp_c}°C</p>
            <p>Min Temp: ${day.day.mintemp_c}°C</p>
        `;
        forecastDiv.appendChild(dayElem);
    });

    // got help from chatgpt but it doesn't work
    render7DayForecastGraph(data);
    document.getElementById('7-day-forecast-info').style.display = 'block';
}

document.getElementById('toggleGraphButton').addEventListener('click', function () {
    const graphContainer = document.getElementById('forecast-graph-container');
    const button = document.getElementById('toggleGraphButton');

    if (graphContainer.style.display === 'none') {
        graphContainer.style.display = 'block';
        button.textContent = 'Hide Graph';
    } else {
        graphContainer.style.display = 'none';
        button.textContent = 'Show Graph';
    }
});

// got help from chatgpt
function render7DayForecastGraph(data) {
    if (!data || !data.forecast || !data.forecast.forecastday) {
        console.error('Invalid data for graph rendering');
        return;
    }

    const labels = data.forecast.forecastday.map(day =>
        new Date(day.date).toLocaleDateString()
    );
    const maxTemps = data.forecast.forecastday.map(day => day.day.maxtemp_c);
    const minTemps = data.forecast.forecastday.map(day => day.day.mintemp_c);

    const ctx = document.getElementById('forecastGraph').getContext('2d');


    if (window.forecastChart) {
        window.forecastChart.destroy();
    }
    //got help from chatgpt
    window.forecastChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Max Temperature (°C)',
                    data: maxTemps,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                },
                {
                    label: 'Min Temperature (°C)',
                    data: minTemps,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                },
                tooltip: {
                    enabled: true,
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                    },
                    ticks: {
                        beginAtZero: true,
                    }
                }
            }
        }
    });
}

//got help from chatgpt but it doesn't work
async function plotTemperatureComparisonGraph() {
    const city = document.getElementById('city-input').value || 'Stockholm';
    const unit = document.getElementById('temp-unit').value;

    const openWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;
    const weatherAPIURL = `https://api.weatherapi.com/v1/forecast.json?key=YOUR_WEATHERAPI_KEY&q=${city}&days=1`;

    try {
        const [openWeatherRes, weatherAPIRes] = await Promise.all([
            fetch(openWeatherURL),
            fetch(weatherAPIURL)
        ]);

        const openWeatherData = await openWeatherRes.json();
        const weatherAPIData = await weatherAPIRes.json();

        const openWeatherTemps = openWeatherData.list.slice(0, 8).map(data => data.main.temp);
        const weatherAPITemps = weatherAPIData.forecast.forecastday[0].hour.slice(0, 8).map(data => data.temp_c);

        const labels = openWeatherData.list.slice(0, 8).map(data => new Date(data.dt * 1000).toLocaleTimeString([], { hour: '2-digit' }));

        drawGraph(labels, openWeatherTemps, weatherAPITemps);
    } catch (error) {
        console.error('Error plotting graph:', error);
    }
}

function drawGraph(labels, openWeatherTemps, weatherAPITemps) {
    const ctx = document.getElementById('temp-forecast-graph').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'OpenWeather',
                    data: openWeatherTemps,
                    borderColor: 'blue',
                    fill: false,
                },
                {
                    label: 'WeatherAPI',
                    data: weatherAPITemps,
                    borderColor: 'red',
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
function render7DayForecastGraph(data) {
    const labels = data.forecast.forecastday.map(day => 
        new Date(day.date).toLocaleDateString()
    );
    const maxTemps = data.forecast.forecastday.map(day => day.day.maxtemp_c);
    const minTemps = data.forecast.forecastday.map(day => day.day.mintemp_c);

    const ctx = document.getElementById('forecastGraph').getContext('2d');

    
    if (window.forecastChart) {
        window.forecastChart.destroy();
    }

    
    window.forecastChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Max Temperature (°C)',
                    data: maxTemps,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                },
                {
                    label: 'Min Temperature (°C)',
                    data: minTemps,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                },
                tooltip: {
                    enabled: true,
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                    },
                    ticks: {
                        beginAtZero: true,
                    }
                }
            }
        }
    });
}

// mostly did it myself but also got help from chatgpt
const favoriteCities = JSON.parse(localStorage.getItem('favoriteCities')) || [];


function addFavoriteCity() {
    const city = document.getElementById('favorite-city-input').value.trim();
    if (city && !favoriteCities.includes(city)) {
        favoriteCities.push(city);
        localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
        renderFavoriteCities();
    }
    document.getElementById('favorite-city-input').value = '';
}


function renderFavoriteCities() {
    const favoriteList = document.getElementById('favorite-cities-list');
    favoriteList.innerHTML = '';
    favoriteCities.forEach((city) => {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        listItem.classList.add('favorite-city-item');
        listItem.addEventListener('click', () => {
            document.getElementById('city-input').value = city;
            getWeather();
        });
        favoriteList.appendChild(listItem);
    });
}

// got help from chatgpt
function toggleDarkMode() {
    const isDark = document.getElementById('darkModeToggle').checked;
    document.body.classList.toggle('dark-mode', isDark);
    document.body.classList.toggle('light-mode', !isDark);
    saveDarkModePreference(isDark);
}

function applySavedDarkMode() {
    const isDark = JSON.parse(localStorage.getItem('darkMode'));
    document.getElementById('darkModeToggle').checked = isDark;
    document.body.classList.toggle('dark-mode', isDark);
    document.body.classList.toggle('light-mode', !isDark);
}


function changeThemeBasedOnWeather(weather) {
    if (weather.toLowerCase().includes('rain')) {
        body.style.backgroundColor = '#5DADE2';
    } else if (weather.toLowerCase().includes('cloud')) {
        body.style.backgroundColor = '#AED6F1';
    } else if (weather.toLowerCase().includes('clear')) {
        body.style.backgroundColor = '#85C1E9';
    } else {
        body.style.backgroundColor = '#f0f0f0';
    }
}
function changeThemeBasedOnWeather(weather) {
    const logo = document.getElementById('app-logo');
    if (weather.toLowerCase().includes('rain')) {
        body.style.backgroundColor = '#5DADE2';
        logo.src = 'rainy-logo.png';
    } else if (weather.toLowerCase().includes('cloud')) {
        body.style.backgroundColor = '#AED6F1';
        logo.src = 'cloudy-logo.png';
    } else if (weather.toLowerCase().includes('clear')) {
        body.style.backgroundColor = '#85C1E9';
        logo.src = 'sunny-logo.png';
    } else {
        body.style.backgroundColor = '#f0f0f0';
        logo.src = 'default-logo.png';
    }
}
