const brightnessSlider = document.getElementById('brightness-slider');
const fullscreenButton = document.getElementById('fullscreen-button');
const clockElement = document.getElementById('clock');
const dateElement = document.getElementById('date');
const weatherElement = document.getElementById('weather');
const elements = [clockElement, dateElement, weatherElement];

function updateTime() {
    var now = new Date();
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    var seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = hours + ':' + minutes + ':' + seconds;
}

function updateDate() {
    var now = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('de-DE', options);
}

function updateWeather() {
    var latitude = 51.4818;
    var longitude = 7.2162;
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&current_weather=true';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var temp = Math.round(data.current_weather.temperature);
            var weatherCode = data.current_weather.weathercode;
            var weatherDescription = getWeatherDescription(weatherCode);
            weatherElement.textContent = temp + '°C, ' + weatherDescription;
        } else {
            weatherElement.textContent = 'Wetterdaten nicht verfügbar';
        }
    };
    xhr.onerror = function () {
        weatherElement.textContent = 'Fehler beim Abrufen der Wetterdaten';
    };
    xhr.send();
}

function autoAdjustBrightness() {
    var hour = new Date().getHours();
    var brightness = (hour >= 6 && hour < 22) ? 1 : 0.2;
    elements.forEach(el => {
        el.style.filter = `brightness(${brightness})`;
    });
}

document.getElementById('fullscreen-button').addEventListener('click', function () {
    var element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }

    document.getElementById('fullscreen-button').style.display = 'none';
    document.getElementById('brightness-slider').style.display = 'none';
});

document.querySelector('.container').addEventListener('click', function () {
    toggleFullscreen();
});

function getWeatherDescription(weatherCode) {
    var weatherCodes = {
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
    autoAdjustBrightness();
}

updateAll();
updateWeather();

setInterval(updateAll, 1000);
setInterval(updateWeather, 600000);
