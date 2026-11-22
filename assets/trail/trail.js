(() => {
  const root = document.getElementById('trail-visualisation');
  if (!root) return;
  const total = 1864, pace = 17, midPace = total / 132;
  const $ = selector => root.querySelector(selector);
  const clamp = n => Math.max(0, Math.min(total, n));
  const pct = n => `${clamp(n) / total * 100}%`;
  const number = n => Math.round(clamp(n)).toLocaleString('en-GB');
  const months = ['Jan', 'Feb', 'Mar', 'Apr'];
  // NIWA 1991–2020 monthly station averages: Jan–Apr, mean lows, highs and rainfall.
  const stations = {
    Invercargill: { low:[9.5,9.4,7.8,6], high:[18.9,18.7,17.5,15], rain:[88.7,74.2,91.8,89.5] },
    'Lake Tekapo': { low:[8.5,8.2,6,3.5], high:[22.2,22.2,19.5,15.3], rain:[38.1,42.2,29.2,51] },
    Nelson: { low:[13.7,13.7,11.7,9], high:[22.5,22.7,21.2,18.4], rain:[73.2,62.8,71.1,84.9] },
    Wellington: { low:[13.7,13.9,12.7,11], high:[20.3,20.6,19.1,16.7], rain:[79.2,55.5,99.6,126.7] },
    'Taupō': { low:[11.6,11.9,9.8,7.2], high:[23,23,20.7,17.4], rain:[73.4,64.8,65.9,77.3] },
    Hamilton: { low:[12.8,13.1,11.4,9.1], high:[24.6,25.1,23.4,20.3], rain:[75.4,65,75.4,92.3] },
    Auckland: { low:[16.1,16.6,14.9,12.8], high:[23.9,24.4,22.9,20.4], rain:[58.1,63.1,75,87.1] },
    Kaitāia: { low:[14.8,15.6,14.3,12.9], high:[23.6,24.5,23,20.9], rain:[75,86,84.7,98.8] }
  };
  // Approximate broad planning zones, not precise trail section boundaries.
  const zones = [
    {end:180, name:'Southland', station:'Invercargill', text:'Coastal paths and beaches give way to forest, farmland and backcountry tracks. Mud, uneven ground and river crossings can slow progress.'},
    {end:355, name:'Otago and the southern lakes', station:'Lake Tekapo', text:'A mix of lakeside tracks and demanding alpine country: steep climbs, exposed ridges, tussock and rough footing. Some lake and valley stretches are easier.'},
    {end:635, name:'Canterbury high country', station:'Lake Tekapo', text:'Open valleys, riverbeds, high passes and long backcountry stretches, with some easier lake paths. River crossings, rough ground and weather can mean slow going or detours.'},
    {end:810, name:'Nelson Lakes to Cook Strait', station:'Nelson', text:'The Richmond Ranges bring steep, rugged and exposed mountain travel before forest, tracks and easier paths through the Marlborough Sounds. The island transfer is compressed here.'},
    {end:1050, name:'Wellington and lower North Island', station:'Wellington', text:'City and coastal paths contrast with the steep, exposed Tararua Ranges, followed by a mixture of tracks, farmland and road connections.'},
    {end:1260, name:'Whanganui and Tongariro', station:'Taupō', text:'The route includes the Whanganui River journey and forest tracks before the exposed volcanic terrain of Tongariro. River travel is not walking; weather can change plans.'},
    {end:1540, name:'Waikato to Auckland', station:'Hamilton', text:'Forest tracks, farmland, cycle trails and road or urban paths make a varied mix. Some forest climbs and muddy tracks can be slow even where gradients look modest.'},
    {end:1864, name:'Auckland to Cape Reinga', station:'Kaitāia', text:'Urban and coastal paths give way to forest, road links and long northern beaches. Sand, tides, exposed coastline and muddy forest can affect the pace.'}
  ];
  // Broad features in each zone; they are not surface proportions or precise locations.
  const terrainTypes = [
    ['Beach','Forest','Farmland','Rivers'], ['Alpine','Lakeside','Rough track'],
    ['Alpine','Riverbeds','Valleys'], ['Alpine','Forest','Coastal track'],
    ['Urban paths','Coast','Ranges','Road'], ['River journey','Forest','Volcanic'],
    ['Forest','Farmland','Trails','Road'], ['Urban paths','Forest','Road','Beach']
  ];
  // Towns are comparison stations, not claims of the weather at the walker's position.
  const stationFor = mile => mile >= 1420 && mile < 1540 ? 'Auckland' : zones.find(z => mile <= z.end).station;
  const hotspots = [[230,12,.42],[355,12,.38],[635,12,.30],[792,18,.62],[830,12,.48],[1160,9,.91],[1480,18,.56],[1864,7,.32]];
  const peak = (mile, centre, width) => Math.exp(-.5 * ((mile-centre)/width)**2);
  const local = mile => .05 + hotspots.reduce((sum,[c,w,a]) => sum + a*peak(mile,c,w),0);
  function range(name, lo, hi, centre) {
    const band = $(`.band.${name}`), mark = $(`.centre.${name}`);
    const active = hi >= 0 && lo <= total;
    band.hidden = !active; mark.hidden = !active || centre < 0 || centre > total;
    if (!active) return 'finished';
    band.style.left = pct(lo); band.style.width = `${(clamp(hi)-clamp(lo))/total*100}%`;
    mark.style.left = pct(centre);
    return `${number(lo)}–${number(hi)} mi`;
  }
  const ukRain = [121.5, 96.1, 85.1, 71.7]; // UK 1991–2020 area average, Met Office.
  function context(id) {
    const slider = document.getElementById(`${id}-day`), day = Number(slider.value);
    const date = new Date(Date.UTC(2027,0,1+day));
    const dateText = new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(date);
    const mile = clamp(day*pace), zone = zones.find(z => mile <= z.end);
    $(`#${id}-date`).textContent = dateText;
    slider.setAttribute('aria-valuetext',dateText);
    $(`#${id}-position`).textContent = `${dateText} · ${zone.name} · ${number(mile)} miles from Bluff`;
    return {day, mile, zone, month:date.getUTCMonth()};
  }
  function updatePeople() {
    const {day,mile} = context('people');
    $('#people-panel').querySelectorAll('.marker').forEach(el => {el.style.left = pct(mile);});
    const northCentre = (day+37)*midPace, southCentre = total-(day+47)*midPace;
    const north = range('north',(day+22)*11,(day+42)*16,northCentre);
    const south = range('south',total-(day+68)*16,total-(day+27)*11,southCentre);
    $('#trail-ranges').textContent = `Approximate ranges from Bluff: northbound ${north}; southbound ${south}.`;
    const northWidth = ((day+42)*16-(day+22)*11)/4;
    const southWidth = ((day+68)*16-(day+27)*11)/4;
    const combined = x => local(x) + (northCentre <= total ? .17*peak(x,northCentre,northWidth) : 0) + (southCentre >= 0 ? .44*peak(x,southCentre,southWidth) : 0);
    [['local-line',local],['combined-line',combined]].forEach(([cls,fn]) => {
      $(`.${cls}`).setAttribute('points',Array.from({length:501},(_,i) => `${i*2},${(98-96*fn(total*i/500)/1.5).toFixed(2)}`).join(' '));
    });
    const score = combined(mile), level = score >= .6 ? 'high' : score >= .28 ? 'moderate' : 'low';
    $('#trail-busyness').textContent = `At our estimated position: ${level} relative activity.`;
  }
  function updateWeather() {
    const {mile,month} = context('weather');
    const stationName = stationFor(mile), station = stations[stationName];
    const temps = $('#temperature-chart');
    temps.innerHTML = months.map((m,i) => `<div class="temp-row${i===month?' current':''}"><span>${m}</span><span class="temp-low">${station.low[i]}°</span><span class="temp-track"><span style="left:${station.low[i]/30*100}%;width:${(station.high[i]-station.low[i])/30*100}%"></span></span><span>${station.high[i]}°</span></div>`).join('');
    temps.setAttribute('aria-label',`${stationName}, average daily low and high: ${months.map((m,i) => `${m} ${station.low[i]} to ${station.high[i]} degrees Celsius`).join(', ')}`);
    const weather = $('#trail-weather');
    weather.innerHTML = months.map((m,i) => `<div class="weather-month${i===month?' current':''}"><div class="rain-scale"><span class="rain-bar" style="height:${station.rain[i]/150*100}%"></span><span class="uk-line" style="bottom:${ukRain[i]/150*100}%"></span></div><span>${m}</span><span>${station.rain[i]} mm</span><span class="uk-label">UK ${ukRain[i]}</span></div>`).join('');
    weather.setAttribute('aria-label',`${stationName}, average monthly rainfall: ${months.map((m,i) => `${m} ${station.rain[i]} millimetres, UK ${ukRain[i]} millimetres`).join('; ')}`);
    const comparison = station.rain[month] > ukRain[month] ? 'above' : station.rain[month] < ukRain[month] ? 'below' : 'equal to';
    $('#trail-weather-text').textContent = `${stationName} station in ${months[month]}: ${station.rain[month]} mm, ${comparison} the UK average of ${ukRain[month]} mm.`;
  }
  function updateTerrain() {
    const {mile,zone} = context('terrain');
    $('#terrain-panel .marker').style.left = pct(mile);
    $('#trail-terrain').textContent = `${zone.name}: ${zone.text}`;
    $('#terrain-zones').innerHTML = zones.map((z,i) => `<div class="terrain-zone${z===zone?' active':''}"><strong>${z.name}${z===zone?' · current':''}</strong><div>${terrainTypes[i].map(t => `<span>${t}</span>`).join('')}</div></div>`).join('');
    const points = window.trailMapPoints;
    if (!points || !points.length) return;
    const km = (1-mile/total)*3058;
    let i = points.findIndex(p => p[0] >= km);
    if (i < 0) i = points.length-1;
    const b=points[i], a=points[Math.max(0,i-1)], ratio=b[0]===a[0]?0:(km-a[0])/(b[0]-a[0]);
    const x=a[1]+ratio*(b[1]-a[1]), y=a[2]+ratio*(b[2]-a[2]);
    ['#map-dot','#map-dot-halo'].forEach(selector => { $(selector).setAttribute('cx',x.toFixed(1)); $(selector).setAttribute('cy',y.toFixed(1)); });
    $('.trail-map').setAttribute('aria-label',`New Zealand overview map. Estimated position: ${zone.name}, ${number(mile)} miles from Bluff. The line is a simplified route.`);
  }
  let previous = 0;
  root.querySelectorAll('.terrain-strip span').forEach((el,i) => {el.style.setProperty('--size',zones[i].end-previous); previous=zones[i].end;});
  [['people',updatePeople],['weather',updateWeather],['terrain',updateTerrain]].forEach(([id,update]) => {
    document.getElementById(`${id}-day`).addEventListener('input',update);
    update();
  });
})();
