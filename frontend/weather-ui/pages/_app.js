import { ApolloProvider } from '@apollo/client';
import { getClient } from '../src/utils/makeApolloClient';
import 'antd/dist/antd.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={getClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp