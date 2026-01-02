import { createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getAppConfig } from '../config/app.config';
import { APP_CONSTANTS } from '../constants/app.constants';

/**
 * Creates an authenticated Apollo Client link
 * Adds JWT token to all GraphQL requests and handles errors
 * 
 * @param getAccessTokenSilently - Auth0 function to get access token
 * @returns Apollo Client link chain
 */
export const createAuthLink = (
  getAccessTokenSilently: () => Promise<string>,
) => {
  const config = getAppConfig();

  const httpLink = createHttpLink({
    uri: config.apollo.graphqlUrl,
  });

  const authLink = setContext(async (_, { headers }) => {
    try {
      const token = await getAccessTokenSilently();
      
      if (!token) {
        throw new Error(APP_CONSTANTS.ERROR_MESSAGES.AUTH_NO_TOKEN);
      }

      return {
        headers: {
          ...headers,
          authorization: `${APP_CONSTANTS.APOLLO.BEARER_PREFIX}${token}`,
        },
      };
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error(APP_CONSTANTS.ERROR_MESSAGES.AUTH_NO_TOKEN);
    }
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) => {
        // Error handling - can be extended with error reporting service
        if (process.env.NODE_ENV === 'development') {
          // Only log in development
        }
      });
    }
    
    if (networkError) {
      // Network error handling - can be extended with error reporting service
      if (process.env.NODE_ENV === 'development') {
        // Only log in development
      }
    }
  });

  return from([errorLink, authLink, httpLink]);
};

