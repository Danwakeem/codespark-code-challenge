import { gql, ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getConfig } from '../config/get-config';
import { get } from 'lodash';

const { api, env, cypress } = getConfig();

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, path }) => {
      const errorMessage = `[GraphQL error]: Message: ${message}, Path: ${path}`;
      console.log(errorMessage);
    });
  }

  if (networkError) {
    const errorMessage = `[Network error]: ${networkError}`;
    console.log(errorMessage);
  }
});

const customFetch = (uri, options) => {
  const { query } = JSON.parse(options.body);
  const obj = gql`
    ${query}
  `;
  return fetch(
    `${uri}?operationName=${encodeURI(get(obj, 'definitions[0].selectionSet.selections[0].name.value'))}`,
    options
  );
};

const httpLink = () => {
  let options = {
    uri: api,
  };
  if (cypress) {
    options = { fetch: customFetch };
  }
  return createHttpLink(options);
};

const authLink = setContext(async (_, { headers }) => {
  return {
    headers: {
      ...headers,
      'apollographql-client-name': `weather-ui-${env}`,
    },
  };
});

const getClient = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink()]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export { getClient };
