const { gql, ApolloError } = require('apollo-server');
const { getDayOfYear } = require('date-fns');
const { get } = require('lodash');

const typeDefs = gql`
  type ForecastHourly {
    id: ID!
    dt: Int
    temp: Float
    feelsLike: Float
    icon: String
    description: String
  }

  type ForecastDay {
    id: ID!
    dt: Int
    min: Float
    max: Float
    uvi: Float
    description: String
    hourly: [ForecastHourly]
  }

  type Forecast {
    id: ID!
    zip: Int!
    city: String
    country: String
    daily: [ForecastDay]
  }

  extend type Query {
    "Query that will return the 5 day forecast"
    forecast(zip: Int!): Forecast
  }
`;

const resolvers = {
  Query: {
    forecast: async (_, input, { OpenWeatherService }) => {
      try {
        const response = await OpenWeatherService.getForecast(input);
        return response;
      } catch (error) {
        return new ApolloError('Failed to fetch forecast. Please try again.', 'FORECAST_FAILED');
      }
    },
  },
  Forecast: {
    city: ({ city: { name } }) => name,
    country: ({ city: { country } }) => country,
    daily: ({ id, daily, hourly }) => {
      const list = daily.map((day) => ({
        id: `${id}:${day.dt.toString()}`,
        dt: day.dt,
        min: day.temp.min,
        max: day.temp.max,
        uvi: day.uvi,
        description: get(day, 'weather[0].description'),
        hourly: hourly
          .filter((hour) => getDayOfYear(new Date(hour.dt * 1000)) === getDayOfYear(new Date(day.dt * 1000)))
          .map((hour) => ({
            id: `${id}:${hour.dt.toString()}`,
            dt: hour.dt,
            temp: hour.main.temp,
            feelsLike: hour.main.feels_like,
            icon: get(hour, 'weather[0].icon'),
            description: get(hour, 'weather[0].description'),
          })),
      }));

      return list.filter((item) => item.hourly.length !== 0);
    },
  },
};

module.exports = { typeDefs, resolvers };
