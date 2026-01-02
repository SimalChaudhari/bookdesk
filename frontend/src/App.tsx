import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { ApolloClient, ApolloProvider } from '@apollo/client';
import { Box, Spinner, Center, Text, Button } from '@chakra-ui/react';
import { createAuthLink } from './apollo/client';
import { InMemoryCache } from '@apollo/client';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * AppContent - Main app component with authentication and GraphQL setup
 * Creates Apollo Client with Auth0 JWT tokens for GraphQL requests
 */
function AppContent() {
  const { isAuthenticated, isLoading, getAccessTokenSilently, error: authError } = useAuth0();
  
  // Use React.useMemo to ensure Apollo Client is only created once
  const apolloClient = React.useMemo(() => {
    if (!isAuthenticated) {
      return null;
    }
    
    const link = createAuthLink(getAccessTokenSilently);
    const client = new ApolloClient({
      link,
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-first',
          nextFetchPolicy: 'cache-first',
        },
        query: {
          fetchPolicy: 'cache-first',
        },
      },
      // Enable query deduplication to prevent duplicate requests
      queryDeduplication: true,
    });
    return client;
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

  // Show error if authentication failed
  if (authError) {
    console.error('Auth0 error:', authError);
    
    // Clear Auth0 cache on invalid state error
    const handleClearCache = () => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    };
    
    return (
      <Box minH="100vh" bg="gray.50" p={8}>
        <Center h="100vh">
          <Box textAlign="center" maxW="md">
            <Text color="red.500" mb={4} fontSize="lg" fontWeight="bold">
              Authentication Error
            </Text>
            <Text color="gray.600" mb={6}>
              {authError.message === 'Invalid state' 
                ? 'Please try signing in again. If the problem persists, clear your browser cache.'
                : authError.message}
            </Text>
            <Button colorScheme="blue" onClick={handleClearCache} mr={3}>
              Clear Cache & Retry
            </Button>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </Box>
        </Center>
      </Box>
    );
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Box>
    );
  }

  // If authenticated but Apollo client not ready, show loading
  if (!apolloClient) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Show dashboard when authenticated and Apollo client ready
  return (
    <ApolloProvider client={apolloClient}>
      <Box minH="100vh" bg="gray.50">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </ApolloProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App;

