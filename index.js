const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');

require('dotenv').config();

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api/location', (req, res) => {
  database.find({}, (err, data) => {
    if (err) {
      res.end();
      return;
    }
    res.json(data);
  });
});

app.post('/api/location', (req, res) => {
  const data = req.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  console.log(data);
  database.insert(data);
  data.success = 'true';
  res.json(data);
});

app.get('/api/weather/:latlon', async (req, res) => {
  let data;
  try {
    const weather_url = `http://api.weatherapi.com/v1/forecast.json?key=${process.env.API_KEY}&q=${req.params.latlon}`;
    const weather_response = await fetch(weather_url);
    const weather_json = await weather_response.json();

    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${req.params.latlon}`;
    const aq_response = await fetch(aq_url);
    const aq_json = await aq_response.json();

    data = {
      weather: weather_json,
      air_quality: aq_json,
    };
  } catch (error) {
    console.error(error);
  }
  res.json(data);
});

app.listen(process.env.PORT, () => {
  console.log(`Listening at ${process.env.PORT}`);
});
