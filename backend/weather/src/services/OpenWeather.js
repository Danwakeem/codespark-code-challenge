const { OpenWeatherRepository } = require('../repositories/OpenWeather');

const OpenWeatherService = () => {
  const { getHourly, getDaily } = OpenWeatherRepository();

  const getForecast = async ({ zip }) => {
    const [{ list: hourly, city }, daily] = await Promise.all([getHourly({ zip }), getDaily({ zip })]);

    return {
      id: zip.toString(),
      zip,
      hourly,
      daily,
      city,
    };
  };

  return {
    getForecast,
  };
};

module.exports = { OpenWeatherService };
