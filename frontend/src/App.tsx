import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Box, Spinner, Center, Text, Button } from '@chakra-ui/react';
import { createAuthLink } from './apollo/client';
import { getAppConfig } from './config/app.config';
import { APP_CONSTANTS } from './constants/app.constants';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * AppContent - Main app component with authentication and GraphQL setup
 * Creates Apollo Client with Auth0 JWT tokens for GraphQL requests
 */
function AppContent() {
  const { isAuthenticated, isLoading, getAccessTokenSilently, error: authError } = useAuth0();
  
  const config = getAppConfig();
  
  const apolloClient = React.useMemo(() => {
    if (!isAuthenticated) {
      return null;
    }

    const link = createAuthLink(getAccessTokenSilently);
    
    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: config.apollo.fetchPolicy,
          nextFetchPolicy: config.apollo.fetchPolicy,
        },
        query: {
          fetchPolicy: config.apollo.fetchPolicy,
        },
      },
      queryDeduplication: config.apollo.queryDeduplication,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Show loading while Auth0 is checking authentication
  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (authError) {
    const handleClearCache = () => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = APP_CONSTANTS.ROUTES.LOGIN;
    };

    const isInvalidStateError = authError.message === 'Invalid state';

    return (
      <Box minH="100vh" bg="gray.50" p={8}>
        <Center h="100vh">
          <Box textAlign="center" maxW="md">
            <Text color="red.500" mb={4} fontSize="lg" fontWeight="bold">
              {APP_CONSTANTS.UI_MESSAGES.AUTH_ERROR_TITLE}
            </Text>
            <Text color="gray.600" mb={6}>
              {isInvalidStateError
                ? APP_CONSTANTS.UI_MESSAGES.AUTH_ERROR_DESCRIPTION
                : authError.message}
            </Text>
            <Button colorScheme="blue" onClick={handleClearCache} mr={3}>
              {APP_CONSTANTS.UI_MESSAGES.CLEAR_CACHE}
            </Button>
            <Button onClick={() => window.location.reload()}>
              {APP_CONSTANTS.UI_MESSAGES.RELOAD_PAGE}
            </Button>
          </Box>
        </Center>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Routes>
          <Route path={APP_CONSTANTS.ROUTES.LOGIN} element={<Login />} />
          <Route
            path="*"
            element={<Navigate to={APP_CONSTANTS.ROUTES.LOGIN} replace />}
          />
        </Routes>
      </Box>
    );
  }

  if (!apolloClient) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      <Box minH="100vh" bg="gray.50">
        <Routes>
          <Route
            path={APP_CONSTANTS.ROUTES.HOME}
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to={APP_CONSTANTS.ROUTES.HOME} replace />}
          />
        </Routes>
      </Box>
    </ApolloProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App;

