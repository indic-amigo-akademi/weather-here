const button = document.getElementById('submit');

function setup() {
  noCanvas();

  let longitude, latitude;
  // button.addEventListener('click', async (event) => {
  //   const data = { latitude, longitude };
  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(data),
  //   };
  //   const response = await fetch('/api/location', options);
  //   const json = await response.json();
  //   console.log(json);
  // });
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
  } else {
    console.log('Geolocation available');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        let latitude, longitude, weather, air;
        try {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          console.log(latitude, longitude);
          document.getElementById('lat').textContent = parseFloat(
            latitude,
          ).toFixed(4);
          document.getElementById('lon').textContent = parseFloat(
            longitude,
          ).toFixed(4);

          const api_url = `/api/weather/${latitude},${longitude}`;
          const response = await fetch(api_url);
          const json = await response.json();
          console.log(json);

          weather = json.weather.current;
          air = json.air_quality.results[0].measurements[0];

          document.getElementById(
            'summary',
          ).innerHTML = `${weather.condition.text} <img class="weather-icon" src="${weather.condition.icon}">`;
          document.getElementById('temperature').textContent =
            weather.feelslike_c;

          document.getElementById('aq_parameter').textContent = air.parameter;
          document.getElementById('aq_value').textContent = air.value;
          document.getElementById('aq_units').textContent = air.unit;
          document.getElementById('aq_date').textContent = air.lastUpdated;
        } catch (error) {
          console.error(error);
          air = { value: -1 };
          document.getElementById('aq_value').textContent = 'NO READING';
        }

        const data = { latitude, longitude, air, weather };
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        };
        const db_response = await fetch('/api/location', options);
        const db_json = await db_response.json();
        console.log(db_json);
      },
      () => {
        console.error('Unable to retrieve your location');
      },
    );
  }
}
