const { gql } = require('apollo-server');
const GraphQLJSON = require('graphql-type-json');
const { GraphQLJSONObject } = GraphQLJSON;

const typeDefs = gql`
  scalar JSON
  scalar JSONObject
  directive @cacheControl(maxAge: Int, scope: CacheControlScope) on OBJECT | FIELD | FIELD_DEFINITION

  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  type Query {
    "Healthcheck endpoint to give a true value if server is running"
    weatherHealthcheck: Boolean!
  }

  type Mutation {
    "Healthcheck endpoint to test a simple mutation"
    weatherEcho(input: String!): String!
  }
`;

const resolvers = {
  Query: {
    weatherHealthcheck: () => true,
  },
  Mutation: {
    weatherEcho: (_, { input }) => input,
  },
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
};

module.exports = { typeDefs, resolvers };
