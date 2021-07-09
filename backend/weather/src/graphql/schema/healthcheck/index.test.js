const { gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');
const { server } = require('../../server');

describe('GQL::Healthcheck', () => {
  let testServer;
  beforeEach(async () => {
    console.info = jest.fn();
    testServer = createTestClient(server);
  });

  describe('Query::healthcheck', () => {
    it('should return true', async () => {
      const out = await testServer.query({
        query: gql`
          query {
            weatherHealthcheck
          }
        `,
      });

      expect(out.data.weatherHealthcheck).toEqual(true);
    });
  });

  describe('Mutation::weatherEcho', () => {
    it('should return input string', async () => {
      const expectedString = 'hi mom';
      const out = await testServer.query({
        mutation: gql`
          mutation ($input: String!) {
            weatherEcho(input: $input)
          }
        `,
        variables: {
          input: expectedString,
        },
      });

      expect(out.data.weatherEcho).toEqual(expectedString);
    });
  });
});
