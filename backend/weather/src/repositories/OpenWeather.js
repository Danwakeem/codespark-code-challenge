const axios = require('axios');
const coords = require('./../util/zip.coords.json');

const OpenWeatherRepository = () => {
  const { API_KEY: appid, BASE_URL: url } = process.env;
  const defaultUnits = 'imperial';

  const getHourly = ({ zip }) =>
    axios
      .get(`${url}/forecast`, {
        params: {
          zip,
          appid,
          units: defaultUnits,
        },
      })
      .then(({ data: { list, city } }) => ({ list, city }))
      .catch((error) => {
        console.error('OpenWeather::getHourly - failed', error);
        throw error;
      });

  const getDaily = ({ zip }) => {
    const position = coords[zip];
    if (!position) {
      const error = new Error('Could not find coordinates');
      console.error('OpenWeather::getDaily - could not find coordinates', error);
      throw error;
    }
    const [lat, lon] = position;

    return axios
      .get(`${url}/onecall`, {
        params: {
          lat,
          lon,
          units: defaultUnits,
          appid,
          exclude: 'minutely,hourly',
        },
      })
      .then(({ data: { daily } }) => daily)
      .catch((error) => {
        console.error('OpenWeather::getDaily - failed', error);
        throw error;
      });
  };

  return {
    getHourly,
    getDaily,
  };
};

module.exports = { OpenWeatherRepository };
