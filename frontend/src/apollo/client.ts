import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:4000/graphql',
});

/**
 * Create authenticated Apollo Client link
 * Adds JWT token to all GraphQL requests
 */
export const createAuthLink = (getAccessTokenSilently: () => Promise<string>) => {
  const authLink = setContext(async (_, { headers }) => {
    try {
      const token = await getAccessTokenSilently();
      if (!token) {
        console.error('No token received from Auth0');
        throw new Error('No access token available');
      }
      
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${token}`,
        },
      };
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  return from([errorLink, authLink, httpLink]);
};

