
const weatherApi = {
    key: "39eca25897c7a9e89f5cb3c1d42f35b6", 
    url: "https://api.openweathermap.org/data/2.5/weather",
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

// Fetch weather
async function getWeatherReport(city) {
    try {
        const response = await fetch(`${weatherApi.url}?q=${city}&appid=${weatherApi.key}&units=metric`);
        if (!response.ok) throw new Error("city not found!");

        const data = await response.json();
        showWeatherReport(data);

        divWeatherBody.classList.remove("d-none");
        divErrorMessage.classList.add("d-none");
    } catch (error) {
        console.log(`error: ${error}`);
        divWeatherBody.classList.add("d-none");
        divErrorMessage.classList.remove("d-none");
        clearWeatherDisplay();
    }
}

function showWeatherReport(weather) {
    hcity.innerText = `${weather.name}, ${weather.sys.country}`;
    pdate.innerText = formatDate(new Date());
    htemp.innerText = `${weather.main.temp}°C`;
    pMinMax.innerText = `${weather.main.temp_min}°C (min), ${weather.main.temp_max}°C (max)`;
    pWeather.innerText = weather.weather[0].main;
    pHumidity.innerText = `${weather.main.humidity}%`;
    pWind.innerText = `${(weather.wind.speed * 3.6).toFixed(1)} km/h`; // convert m/s → km/h
    pPressure.innerText = `${weather.main.pressure} hPa`;

    updateBackground(weather.weather[0].main);
}

function formatDate(date) {
    const obj = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    return date.toLocaleDateString(undefined, obj);
}

function updateBackground(weatherType) {
    const backgrounds = {
        Clear: "image/clear.png",
        Clouds: "image/cloud.jpg",
        Haze: "image/haze.png",
        Rain: "image/rain.png",
        Thunderstorm: "image/thunderstorm.jpeg",
        Snow: "image/snow.png",
        Sunny: "image/sunny.jpg"
    };

    document.body.style.backgroundImage =
        `url(${backgrounds[weatherType] || "image/clear.jpg"})`;
}

function clearWeatherDisplay() {
    hcity.innerText = "";
    pdate.innerText = "";
    htemp.innerText = "";
    pMinMax.innerText = "";
    pWeather.innerText = "";
    pHumidity.innerText = "";
    pWind.innerText = "";
    pPressure.innerText = "";
}

// Event listeners
btnWeather.addEventListener("click", () => {
    const city = txtInput.value.trim();
    if (city) getWeatherReport(city);
});

txtInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") btnWeather.click();
});
