const { ApolloServer } = require('apollo-server');
const { buildSchema } = require('./buildSchema');
const context = require('./context');

const server = new ApolloServer({
  schema: buildSchema(),
  context,
});

module.exports = { server };
