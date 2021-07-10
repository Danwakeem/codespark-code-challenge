const { gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');
const { get } = require('lodash');
const axios = require('axios');
const { server } = require('../../server');

jest.mock('axios');

describe('GQL::Forecast', () => {
  let testServer;
  beforeEach(async () => {
    console.info = jest.fn();
    console.error = jest.fn();
    testServer = createTestClient(server);
  });

  afterEach(() => {
    console.error.mockClear();
    axios.get.mockClear();
  });

  describe('Query::forecast', () => {
    it('should return forecast', async () => {
      const hourlyMock = {
        data: {
          city: {
            name: 'Test',
            country: 'US',
          },
          list: [
            {
              dt: 1625859789,
              main: {
                temp: 80,
                feels_like: 90,
              },
              weather: [
                {
                  icon: '1b',
                  description: 'hi mom',
                },
              ],
            },
            {
              dt: 1625427851,
              main: {
                temp: 70,
                feels_like: 100,
              },
              weather: [
                {
                  icon: '1c',
                  description: 'hi dad',
                },
              ],
            },
          ],
        },
      };

      const dailyMock = {
        data: {
          timezone_offset: -1800,
          daily: [
            {
              dt: 1625859797,
              temp: {
                min: 1,
                max: 100,
              },
              uvi: 0.98,
              weather: [
                {
                  description: 'hi brother',
                },
              ],
            },
            {
              dt: 1625427873,
              temp: {
                min: 4,
                max: 10,
              },
              uvi: 0.99,
              weather: [
                {
                  description: 'hi sister',
                },
              ],
            },
          ],
        },
      };

      axios.get.mockResolvedValueOnce(hourlyMock);
      axios.get.mockResolvedValueOnce(dailyMock);

      const expectedZipCode = '75070';
      const out = await testServer.query({
        query: gql`
          query GET_FORECAST($zip: String!) {
            forecast(zip: $zip) {
              id
              city
              country
              daily {
                id
                dt
                min
                max
                uvi
                description
                hourly {
                  id
                  dt
                  temp
                  feelsLike
                  icon
                  description
                }
              }
            }
          }
        `,
        variables: {
          zip: expectedZipCode,
        },
      });

      expect(out.data.forecast).toEqual({
        id: expectedZipCode,
        city: hourlyMock.data.city.name,
        country: hourlyMock.data.city.country,
        daily: [
          {
            id: `75070:${dailyMock.data.daily[0].dt.toString()}`,
            dt: dailyMock.data.daily[0].dt,
            min: dailyMock.data.daily[0].temp.min,
            max: dailyMock.data.daily[0].temp.max,
            uvi: dailyMock.data.daily[0].uvi,
            description: dailyMock.data.daily[0].weather[0].description,
            hourly: [
              {
                id: `75070:${hourlyMock.data.list[0].dt.toString()}`,
                dt: hourlyMock.data.list[0].dt,
                temp: hourlyMock.data.list[0].main.temp,
                feelsLike: hourlyMock.data.list[0].main.feels_like,
                icon: hourlyMock.data.list[0].weather[0].icon,
                description: hourlyMock.data.list[0].weather[0].description,
              },
            ],
          },
          {
            id: `75070:${dailyMock.data.daily[1].dt.toString()}`,
            dt: dailyMock.data.daily[1].dt,
            min: dailyMock.data.daily[1].temp.min,
            max: dailyMock.data.daily[1].temp.max,
            uvi: dailyMock.data.daily[1].uvi,
            description: dailyMock.data.daily[1].weather[0].description,
            hourly: [
              {
                id: `75070:${hourlyMock.data.list[1].dt.toString()}`,
                dt: hourlyMock.data.list[1].dt,
                temp: hourlyMock.data.list[1].main.temp,
                feelsLike: hourlyMock.data.list[1].main.feels_like,
                icon: hourlyMock.data.list[1].weather[0].icon,
                description: hourlyMock.data.list[1].weather[0].description,
              },
            ],
          },
        ],
      });
    });

    it('should return error if zip is not found in map', async () => {
      const hourlyMock = {
        data: {
          list: [
            {
              dt: 1625859789,
              main: {
                temp: 80,
                feels_like: 90,
              },
              weather: [
                {
                  icon: '1b',
                },
              ],
            },
            {
              dt: 1625427851,
              main: {
                temp: 70,
                feels_like: 100,
              },
              weather: [
                {
                  icon: '1c',
                },
              ],
            },
          ],
        },
      };

      const dailyMock = {
        data: {
          daily: [
            {
              dt: 1625859797,
              temp: {
                min: 1,
                max: 100,
              },
              uvi: 0.98,
            },
            {
              dt: 1625427873,
              temp: {
                min: 4,
                max: 10,
              },
              uvi: 0.99,
            },
          ],
        },
      };

      axios.get.mockResolvedValueOnce(hourlyMock);
      axios.get.mockResolvedValueOnce(dailyMock);

      const expectedZipCode = '1';
      const out = await testServer.query({
        query: gql`
          query GET_FORECAST($zip: String!) {
            forecast(zip: $zip) {
              id
              daily {
                id
                dt
                min
                max
                uvi
                hourly {
                  id
                  dt
                  temp
                  feelsLike
                  icon
                  description
                }
              }
            }
          }
        `,
        variables: {
          zip: expectedZipCode,
        },
      });

      expect(console.error).toHaveBeenCalledWith(
        'OpenWeather::getDaily - could not find coordinates',
        new Error('Could not find coordinates')
      );
      expect(get(out.errors, '[0].message')).toEqual('Failed to fetch forecast. Please try again.');
    });

    it('should return error if daily API call fails ', async () => {
      const expectedError = new Error('Sorry mom');
      axios.get.mockImplementationOnce((url) =>
        /forecast/gi.test(url) ? Promise.resolve({}) : Promise.reject(expectedError)
      );
      axios.get.mockRejectedValue(expectedError);

      const expectedZipCode = '75070';
      const out = await testServer.query({
        query: gql`
          query GET_FORECAST($zip: String!) {
            forecast(zip: $zip) {
              id
              daily {
                id
                dt
                min
                max
                uvi
                hourly {
                  id
                  dt
                  temp
                  feelsLike
                  icon
                  description
                }
              }
            }
          }
        `,
        variables: {
          zip: expectedZipCode,
        },
      });

      expect(console.error).toHaveBeenCalledWith('OpenWeather::getDaily - failed', expectedError);
      expect(get(out.errors, '[0].message')).toEqual('Failed to fetch forecast. Please try again.');
    });

    it('should return error if hourly API call fails ', async () => {
      const expectedError = new Error('Sorry mom');
      axios.get.mockImplementationOnce((url) =>
        /forecast/gi.test(url) ? Promise.reject(expectedError) : Promise.resolve({})
      );
      axios.get.mockRejectedValue(expectedError);

      const expectedZipCode = '75070';
      const out = await testServer.query({
        query: gql`
          query GET_FORECAST($zip: String!) {
            forecast(zip: $zip) {
              id
              daily {
                id
                dt
                min
                max
                uvi
                hourly {
                  id
                  dt
                  temp
                  feelsLike
                  icon
                }
              }
            }
          }
        `,
        variables: {
          zip: expectedZipCode,
        },
      });

      expect(console.error).toHaveBeenCalledWith('OpenWeather::getHourly - failed', expectedError);
      expect(get(out.errors, '[0].message')).toEqual('Failed to fetch forecast. Please try again.');
    });
  });
});
