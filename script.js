const clockElement = document.getElementById('clock');
const dateElement = document.getElementById('date');
const weatherElement = document.getElementById('weather');

function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('de-DE', options);
}

async function updateWeather() {
    const latitude = 51.4818; 
    const longitude = 7.2162; 
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const temp = Math.round(data.current_weather.temperature);
        const weatherCode = data.current_weather.weathercode;

        const weatherDescription = getWeatherDescription(weatherCode);
        weatherElement.textContent = `${temp}°C, ${weatherDescription}`;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherElement.textContent = 'Wetterdaten nicht verfügbar';
    }
}

function getWeatherDescription(weatherCode) {
    const weatherCodes = {
        0: 'Klarer Himmel',
        1: 'Überwiegend klar',
        2: 'Teilweise bewölkt',
        3: 'Bedeckt',
        45: 'Nebel',
        48: 'Nebel mit Raureif',
        51: 'Leichter Nieselregen',
        53: 'Mäßiger Nieselregen',
        55: 'Starker Nieselregen',
        56: 'Leichter gefrierender Nieselregen',
        57: 'Starker gefrierender Nieselregen',
        61: 'Leichter Regen',
        63: 'Mäßiger Regen',
        65: 'Starker Regen',
        66: 'Leichter gefrierender Regen',
        67: 'Starker gefrierender Regen',
        71: 'Leichter Schneefall',
        73: 'Mäßiger Schneefall',
        75: 'Starker Schneefall',
        77: 'Schneegriesel',
        80: 'Leichte Regenschauer',
        81: 'Mäßige Regenschauer',
        82: 'Starke Regenschauer',
        85: 'Leichte Schneeschauer',
        86: 'Starke Schneeschauer',
        95: 'Gewitter',
        96: 'Gewitter mit leichtem Hagel',
        99: 'Gewitter mit starkem Hagel',
    };
    return weatherCodes[weatherCode] || 'Unbekanntes Wetter';
}

function updateAll() {
    updateTime();
    updateDate();
}

setInterval(updateAll, 1000);
updateWeather();
setInterval(updateWeather, 600000);