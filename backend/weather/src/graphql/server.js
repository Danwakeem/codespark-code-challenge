const { ApolloServer } = require('apollo-server');
const { BaseRedisCache } = require('apollo-server-cache-redis');
const responseCachePlugin = require('apollo-server-plugin-response-cache');
const Redis = require('ioredis');
const { buildSchema } = require('./buildSchema');
const context = require('./context');

const server = new ApolloServer({
  schema: buildSchema(),
  context,
  plugins: [responseCachePlugin()],
  ...(process.env.JEST_WORKER_ID ? {} : {
    cache: new BaseRedisCache({
      client: new Redis({
        host: process.env.REDIS_HOST,
      }),
    }),
  }),
  // 2 Hours because that is how long the data refresh time is on OpenWeather free tier
  cacheControl: {
    defaultMaxAge: 7200,
  },
});

module.exports = { server };
