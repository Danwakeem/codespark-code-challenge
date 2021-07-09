const { gql, ApolloError } = require('apollo-server');
const { differenceInDays } = require('date-fns');
const { get } = require('lodash');

const typeDefs = gql`
  type ForecastHourly {
    id: ID!
    dt: Int
    temp: Float
    feelsLike: Float
    icon: String
  }

  type ForecastDay {
    id: ID!
    dt: Int
    min: Float
    max: Float
    uvi: Float
    hourly: [ForecastHourly]
  }

  type Forecast {
    id: ID!
    zip: Int!
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
    daily: ({ id, daily, hourly }) => {
      const list = daily.map((day) => ({
        id: `${id}:${day.dt.toString()}`,
        dt: day.dt,
        min: day.temp.min,
        max: day.temp.max,
        uvi: day.uvi,
        hourly: hourly
          .filter((hour) => differenceInDays(new Date(hour.dt * 1000), new Date(day.dt * 1000)) === 0)
          .map((hour) => ({
            id: `${id}:${hour.dt.toString()}`,
            dt: hour.dt,
            temp: hour.main.temp,
            feelsLike: hour.main.feels_like,
            icon: get(hour, 'weather[0].icon'),
          })),
      }));

      return list.filter((item) => item.hourly.length !== 0);
    },
  },
};

module.exports = { typeDefs, resolvers };
