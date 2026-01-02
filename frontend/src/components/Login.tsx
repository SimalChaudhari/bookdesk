import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  Text,
  HStack,
} from '@chakra-ui/react';

/**
 * Login component for authentication
 * Provides both Sign In and Sign Up options using Auth0
 */
const Login = () => {
  const { loginWithRedirect } = useAuth0();

  // Handle sign in - redirects to Auth0 login page
  const handleSignIn = () => {
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    });
  };

  // Handle sign up - redirects to Auth0 signup page
  const handleSignUp = () => {
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin,
        screen_hint: 'signup',
      },
    });
  };

  return (
    <Container maxW="md" centerContent>
      <Box
        w="100%"
        p={8}
        mt={20}
        bg="white"
        borderRadius="lg"
        boxShadow="md"
      >
        <VStack spacing={6}>
          <Heading size="lg">Book Dashboard</Heading>
          <Text color="gray.600" textAlign="center">
            Please sign in or sign up to access the book management dashboard.
          </Text>
          <VStack spacing={3} w="100%">
            <Button
              colorScheme="blue"
              size="lg"
              w="100%"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              size="lg"
              w="100%"
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;

