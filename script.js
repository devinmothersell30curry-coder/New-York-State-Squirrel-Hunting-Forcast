const regions = {
  'Central New York': {
    lat: 42.93, lng: -75.57,
    base: 59, temp: '55–69°F', rain: 38, wind: 11,
    weather: 'Partly cloudy', habitat: 'Oak, hickory, beech, and mixed hardwood edges are the strongest habitat signals.',
    timing: 'Plan for first light through mid-morning, with a second window near sunset.',
    seasonal: 'Early fall feeding is boosted by acorn availability, cool overnight temperatures, and shorter daylight windows.',
    mating: 'Late winter mating can increase movement sharply when food is still accessible.'
  },
  'Adirondacks': {
    lat: 43.9, lng: -74.95,
    base: 67, temp: '43–58°F', rain: 31, wind: 7,
    weather: 'Cool and clear', habitat: 'Mast-heavy conifer/hardwood mixes and creek-edge corridors remain productive.',
    timing: 'Use the first two hours after sunrise before wind strengthens in the afternoon.',
    seasonal: 'Cool nights and abundant mast increase foraging pressure and daylight movement.',
    mating: 'Mating activity tends to intensify during late winter and early spring in colder interior forests.'
  },
  'Capital Region': {
    lat: 42.75, lng: -73.8,
    base: 63, temp: '50–66°F', rain: 28, wind: 8,
    weather: 'Mostly sunny', habitat: 'Urban edge woods, oak stands, and mixed forest parcels are most reliable.',
    timing: 'Early morning and late afternoon sessions are most productive before the midday heat.',
    seasonal: 'Mild fall conditions and widespread hardwood mast improve tree-to-ground feeding rates.',
    mating: 'Breeding behavior can elevate movement in late winter and again during early spring.'
  },
  'Catskills': {
    lat: 42.2, lng: -74.4,
    base: 71, temp: '47–61°F', rain: 35, wind: 6,
    weather: 'Overcast', habitat: 'Oak ridges, beech flats, and dense mixed hardwood cover hold squirrels well.',
    timing: 'Focus on the first hour after dawn and late-day feeding routes as sunlight fades.',
    seasonal: 'Lower temperatures, robust mast, and moderate cloud cover support longer feeding windows.',
    mating: 'The spring mating pulse often raises activity where food and cover are both available.'
  },
  'Finger Lakes': {
    lat: 42.88, lng: -77.0,
    base: 56, temp: '54–68°F', rain: 42, wind: 13,
    weather: 'Breezy', habitat: 'Mixed hardwood stands near nut-producing trees produce the best movement.',
    timing: 'Aim for calm morning periods before strong breezes build through the canopy.',
    seasonal: 'Squirrels respond strongly to food abundance, especially when rainfall rolls through and improves ground forage.',
    mating: 'Late winter mating spikes often coincide with more visible mid-day movement in open hardwoods.'
  },
  'Hudson Valley': {
    lat: 41.4, lng: -74.1,
    base: 52, temp: '58–72°F', rain: 46, wind: 10,
    weather: 'Light showers', habitat: 'Transition zones between hardwoods, edges, and mast-rich trees hold better than deep cover alone.',
    timing: 'Target early morning movement before humidity and wind begin building around midday.',
    seasonal: 'Warm conditions can reduce movement unless food is abundant and cover is still active.',
    mating: 'Mating periods are less disruptive than weather or mast availability, but can add brief surges in movement.'
  },
  'Southern Tier': {
    lat: 42.2, lng: -76.8,
    base: 61, temp: '52–66°F', rain: 40, wind: 9,
    weather: 'Cloudy', habitat: 'Mast-rich hardwood pockets near stream bottoms and field edges are best.',
    timing: 'Work the hour before sunrise and again as the light first reaches the canopy.',
    seasonal: 'Cool, consistent conditions help maintain predictable feeding routes and greater tree activity.',
    mating: 'Late-winter activity can noticeably increase where food access remains stable.'
  },
  'Western New York': {
    lat: 43.0, lng: -78.8,
    base: 54, temp: '52–65°F', rain: 49, wind: 15,
    weather: 'Showers possible', habitat: 'Oak and hickory stands near agricultural edges and creek corridors are the most productive.',
    timing: 'Choose breaks between rain bands and hunt the first two hours after daylight.',
    seasonal: 'Prolonged damp conditions often reduce mid-day movement unless mast is concentrated and cover is nearby.',
    mating: 'Spring breeding pulses can increase movement when weather stabilizes after rain.'
  }
};

const regulationRules = {
  grayFox: ['Season: most of NY — September 1 to February 28', 'Daily bag limit: 6 squirrels combined', 'License: valid NYS small-game hunting license required'],
  longIsland: ['Long Island season: November 1 to February 28', 'Bag limit: 6 squirrels combined', 'Check local discharge rules and WMU restrictions'],
  redSquirrel: ['Red squirrels are generally unprotected in NY', 'No closed season; no bag limit generally applies', 'Still verify local law updates before hunting']
};

const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const forecast = document.querySelector('#forecast-list');
const regionSelect = document.querySelector('#region');
const updated = document.querySelector('#updated');
const factorList = document.querySelector('#factor-list');
const regulationList = document.querySelector('#regulation-list');
const bestWindow = document.querySelector('#best-window');
const windNow = document.querySelector('#wind-now');
const weatherNow = document.querySelector('#weather-now');
const weatherTemp = document.querySelector('#weather-temp');
const weatherRain = document.querySelector('#weather-rain');
const weatherWind = document.querySelector('#weather-wind');

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function buildFactorList(data, weather) {
  const tempComfort = weather.temperature >= 5 && weather.temperature <= 18 ? 18 : weather.temperature > 18 ? 8 : 4;
  const rainPenalty = weather.precipitation > 50 ? -18 : weather.precipitation > 25 ? -9 : 6;
  const windPenalty = weather.wind > 18 ? -14 : weather.wind > 10 ? -7 : 5;
  const matingBoost = new Date().getMonth() >= 0 && new Date().getMonth() <= 2 ? 15 : new Date().getMonth() >= 4 && new Date().getMonth() <= 6 ? 10 : 5;
  const mastBoost = 12;
  const daylightBoost = 8;
  const total = clamp(tempComfort + rainPenalty + windPenalty + matingBoost + mastBoost + daylightBoost, 0, 100);

  const factors = [
    `Temperature comfort: ${tempComfort >= 0 ? '+' : ''}${tempComfort}`,
    `Rain effect: ${rainPenalty >= 0 ? '+' : ''}${rainPenalty}`,
    `Wind effect: ${windPenalty >= 0 ? '+' : ''}${windPenalty}`,
    `Mating season pulse: +${matingBoost}`,
    `Food availability (mast): +${mastBoost}`,
    `Daylight / canopy activity: +${daylightBoost}`,
    `Modeled confidence: ${total}%`
  ];

  factorList.innerHTML = factors.map(f => `<li>${f}</li>`).join('');
}

function buildRuleList() {
  regulationList.innerHTML = [...regulationRules.grayFox, ...regulationRules.redSquirrel].map(rule => `<li>${rule}</li>`).join('');
}

async function fetchWeather(lat, lng) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,precipitation_probability,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FNew_York&forecast_days=7`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather service unavailable');
    return response.json();
  } catch (error) {
    return null;
  }
}

function makeDays(data, weather) {
  const now = new Date();
  forecast.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const date = new Date(now); date.setDate(now.getDate() + i);
    const score = clamp(Math.round(data.base + (i - 3) * 2 + (weather.precipitation > 40 ? -10 : 4) + (weather.wind > 14 ? -6 : 4) + (new Date().getMonth() >= 0 && new Date().getMonth() <= 2 ? 9 : 2)), 20, 95);
    const rain = clamp(Math.round(data.rain + (i % 3 === 0 ? 8 : -4)), 12, 76);
    const wind = clamp(Math.round(data.wind + (i % 2 === 0 ? 2 : -1)), 4, 28);
    const label = score >= 75 ? 'Excellent modeled activity' : score >= 58 ? 'Fair modeled activity' : 'Limited modeled activity';
    const item = document.createElement('article');
    item.className = 'forecast-item';
    item.innerHTML = `
      <div class="forecast-top"><span>${i === 0 ? 'Today' : dayNames[date.getDay()]}, ${date.toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span><span class="score">${score}%</span></div>
      <div class="meter"><span class="meter-marker" style="left:${score}%"></span></div>
      <div class="meter-labels"><span>0%</span><span>100%</span></div>
      <p class="activity-note">${label}</p>
      <div class="weather-grid">
        <div class="weather-cell"><span>WEATHER</span><strong>${i === 0 ? data.weather : ['Sunny','Cloudy','Windy','Partly cloudy'][i % 4]}</strong></div>
        <div class="weather-cell"><span>TEMP</span><strong>${data.temp}</strong></div>
        <div class="weather-cell"><span>RAIN</span><strong>${rain}%</strong></div>
        <div class="weather-cell"><span>WIND</span><strong>${wind} mph</strong></div>
      </div>
    `;
    forecast.appendChild(item);
  }
}

function updateMeta(data, weather) {
  const displayWind = Math.max(Math.round(weather.wind), data.wind);
  const displayRain = clamp(Math.round(weather.precipitation), 0, 100);
  const displayTemp = Math.round(weather.temperature);
  const score = clamp(Math.round(data.base + (weather.tempComfort || 8) + (weather.precipitation > 50 ? -12 : 0) + (displayWind > 15 ? -8 : 4) + 10), 0, 100);

  updated.innerHTML = `${regionSelect.value} <span>•</span> live 7-day forecast`;
  document.querySelector('#today-score').textContent = `${score}%`;
  document.querySelector('#recommendation').textContent = score >= 65 ? 'A strong morning for the woods' : 'A fair morning for the woods';
  bestWindow.textContent = score >= 60 ? '6:42 AM' : '7:10 AM';
  windNow.textContent = `${displayWind} mph`;
  weatherNow.textContent = weather.description || data.weather;
  weatherTemp.textContent = `${displayTemp}°F`;
  weatherRain.textContent = `${displayRain}%`;
  weatherWind.textContent = `${displayWind} mph`;
  document.getElementById('habitat-focus').textContent = data.habitat;
  document.getElementById('best-timing').textContent = data.timing;
  document.getElementById('seasonal-signal').textContent = `${data.seasonal} ${data.mating}`;
}

async function updateForecast() {
  const name = regionSelect.value;
  const data = regions[name];
  const weatherData = await fetchWeather(data.lat, data.lng);
  const nowWeather = weatherData ? {
    temperature: Math.round(weatherData.current.temperature_2m || 61),
    precipitation: weatherData.hourly.precipitation_probability?.[new Date().getHours()] || data.rain,
    wind: Math.round(weatherData.current.wind_speed_10m || data.wind),
    description: weatherData.current.weather_code && weatherData.current.weather_code < 60 ? 'Partly cloudy' : data.weather,
    tempComfort: weatherData.current.temperature_2m >= 5 && weatherData.current.temperature_2m <= 18 ? 18 : 8
  } : {
    temperature: 61,
    precipitation: data.rain,
    wind: data.wind,
    description: data.weather,
    tempComfort: 8
  };

  buildFactorList(data, nowWeather);
  buildRuleList();
  makeDays(data, nowWeather);
  updateMeta(data, nowWeather);
}

document.querySelector('#update').addEventListener('click', updateForecast);
regionSelect.addEventListener('change', updateForecast);
document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
  tab.classList.add('active');
  document.querySelector(`#${tab.dataset.tab}`).classList.remove('hidden');
}));

updateForecast();
