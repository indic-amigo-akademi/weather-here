// Making a map and tiles
const mymap = L.map('checkinMap', {
  center: [0, 0],
  zoom: 3,
});
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

let firstTime = true;

const getData = async () => {
  const response = await fetch('/api/location');
  const data = await response.json();
  for (item of data) {
    const marker = L.marker([item.latitude, item.longitude]).addTo(mymap);
    console.log(item);
    let txt = `
    The weather here at latitude ${item.latitude}&deg;, longitude
    ${item.longitude}&deg; is ${item.weather.condition.text} <img class="weather-icon" src="${item.weather.condition.icon}"> with a temperature of ${item.weather.feelslike_c} &deg; C.
  `;
    if (item.air.value < 0) {
      txt += '<br>No air quality reading';
    } else {
      txt += `<br>The concentration of particulate matter (${item.air.parameter})
      is ${item.air.value} ${item.air.unit} last read on ${item.air.lastUpdated}.`;
    }

    marker.bindPopup(txt);
  }
};

getData();
