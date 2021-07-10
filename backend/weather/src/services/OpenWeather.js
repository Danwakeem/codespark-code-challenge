const { OpenWeatherRepository } = require('../repositories/OpenWeather');

const OpenWeatherService = () => {
  const { getHourly, getDaily } = OpenWeatherRepository();

  const getForecast = async ({ zip }) => {
    const [{ list: hourly, city }, { timezone_offset, daily }] = await Promise.all([
      getHourly({ zip }),
      getDaily({ zip }),
    ]);

    return {
      id: zip,
      zip,
      hourly,
      daily,
      city,
      timezone_offset,
    };
  };

  return {
    getForecast,
  };
};

module.exports = { OpenWeatherService };
