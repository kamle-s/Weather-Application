const weatherApi = {
  key: "39eca25897c7a9e89f5cb3c1d42f35b6",
  url: "https://api.openweathermap.org/data/2.5/weather"
};

// Elements
const txtInput = document.getElementById("input-box");
const btnWeather = document.getElementById("button");

const hcity = document.getElementById("city");
const pdate = document.getElementById("date");
const htemp = document.getElementById("temp");
const pMinMax = document.getElementById("min-max");
const pWeather = document.getElementById("weather");
const pHumidity = document.getElementById("humidity");
const pWind = document.getElementById("wind");
const pPressure = document.getElementById("pressure");

const divWeatherBody = document.getElementById("weather-body");
const divErrorMessage = document.getElementById("error-message");

// ================= SEARCH BY CITY =================
async function getWeatherReport(city) {
  try {
    const response = await fetch(
      `${weatherApi.url}?q=${city}&appid=${weatherApi.key}&units=metric`
    );
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    showWeatherReport(data);

    divWeatherBody.classList.remove("d-none");
    divErrorMessage.classList.add("d-none");
  } catch {
    divWeatherBody.classList.add("d-none");
    divErrorMessage.classList.remove("d-none");
  }
}

// ================= LOCATION WEATHER =================
async function getWeatherByLocation(lat, lon) {
  const response = await fetch(
    `${weatherApi.url}?lat=${lat}&lon=${lon}&appid=${weatherApi.key}&units=metric`
  );
  const data = await response.json();
  showWeatherReport(data);
  divWeatherBody.classList.remove("d-none");
}

// ================= DISPLAY =================
function showWeatherReport(weather) {
  hcity.innerText = `${weather.name}, ${weather.sys.country}`;
  pdate.innerText = new Date().toDateString();
  htemp.innerText = `${weather.main.temp} °C`;
  pMinMax.innerText = `Min: ${weather.main.temp_min}°C | Max: ${weather.main.temp_max}°C`;
  pWeather.innerText = weather.weather[0].main;
  pHumidity.innerText = `${weather.main.humidity}%`;
  pWind.innerText = `${(weather.wind.speed * 3.6).toFixed(1)} km/h`;
  pPressure.innerText = `${weather.main.pressure} hPa`;

  updateBackground(weather.weather[0].main);
}

// ================= BACKGROUND =================
function updateBackground(type) {
  const bg = {
    Clear: "image/clear.png",
    Clouds: "image/cloud.jpg",
    Rain: "image/rain.png",
    Snow: "image/snow.png",
    Thunderstorm: "image/thunderstorm.jpeg",
    Haze: "image/haze.png"
  };
  document.body.style.backgroundImage = `url(${bg[type] || "image/sunback.jpg"})`;
}

// ================= EVENTS =================
btnWeather.addEventListener("click", () => {
  if (txtInput.value.trim()) getWeatherReport(txtInput.value.trim());
});

txtInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") btnWeather.click();
});

// ================= AUTO LOCATION ON LOAD =================
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => getWeatherByLocation(pos.coords.latitude, pos.coords.longitude),
      () => console.log("Location denied")
    );
  }
};
