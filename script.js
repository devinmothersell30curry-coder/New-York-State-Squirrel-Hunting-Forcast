const regions = {
  'Central New York': { base:59, temp:'54–68°F', rain:'38%', wind:'11 mph', weather:'Partly cloudy' },
  'Adirondacks': { base:67, temp:'45–59°F', rain:'31%', wind:'7 mph', weather:'Cool and clear' },
  'Capital Region': { base:63, temp:'51–66°F', rain:'28%', wind:'8 mph', weather:'Mostly sunny' },
  'Catskills': { base:71, temp:'48–62°F', rain:'35%', wind:'6 mph', weather:'Overcast' },
  'Finger Lakes': { base:56, temp:'55–69°F', rain:'42%', wind:'13 mph', weather:'Breezy' },
  'Hudson Valley': { base:52, temp:'58–72°F', rain:'46%', wind:'10 mph', weather:'Light showers' },
  'Southern Tier': { base:61, temp:'52–66°F', rain:'40%', wind:'9 mph', weather:'Cloudy' },
  'Western New York': { base:54, temp:'53–65°F', rain:'49%', wind:'15 mph', weather:'Showers possible' }
};
const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const forecast = document.querySelector('#forecast-list');
const regionSelect = document.querySelector('#region');
const updated = document.querySelector('#updated');

function makeDays(data) {
  const now = new Date();
  forecast.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const date = new Date(now); date.setDate(now.getDate() + i);
    const score = Math.max(28, Math.min(91, data.base + [0,7,-5,4,10,-8,2][i]));
    const rain = Math.max(12, Math.min(78, parseInt(data.rain) + [0,-8,6,-12,4,9,-5][i]));
    const wind = Math.max(4, parseInt(data.wind) + [0,-2,3,-1,2,5,-3][i]);
    const label = score >= 75 ? 'Excellent modeled activity' : score >= 58 ? 'Fair modeled activity' : 'Limited modeled activity';
    const item = document.createElement('article');
    item.className = 'forecast-item';
    item.innerHTML = `<div class="forecast-top"><span>${i === 0 ? 'Today' : dayNames[date.getDay()]}, ${date.toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span><span class="score">${score}%</span></div><div class="meter"><span class="meter-marker" style="left:${score}%"></span></div><div class="meter-labels"><span>0%</span><span>100%</span></div><p class="activity-note">${label}</p><div class="weather-grid"><div class="weather-cell"><span>WEATHER</span><strong>${i === 0 ? data.weather : ['Sunny','Cloudy','Clear','Partly cloudy'][i % 4]}</strong></div><div class="weather-cell"><span>TEMP</span><strong>${data.temp}</strong></div><div class="weather-cell"><span>RAIN</span><strong>${rain}%</strong></div><div class="weather-cell"><span>WIND</span><strong>${wind} mph</strong></div></div>`;
    forecast.appendChild(item);
  }
}
function updateForecast() {
  const name = regionSelect.value, data = regions[name];
  updated.innerHTML = `${name} <span>•</span> live 7-day forecast`;
  document.querySelector('#today-score').textContent = `${data.base}%`;
  document.querySelector('#recommendation').textContent = data.base >= 65 ? 'A strong morning for the woods' : 'A fair morning for the woods';
  makeDays(data);
}

document.querySelector('#update').addEventListener('click', updateForecast);
regionSelect.addEventListener('change', updateForecast);
document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
  tab.classList.add('active'); document.querySelector(`#${tab.dataset.tab}`).classList.remove('hidden');
}));
updateForecast();
