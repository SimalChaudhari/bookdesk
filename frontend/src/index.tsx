import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const domain = process.env.REACT_APP_AUTH0_DOMAIN || '';
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || '';
const audience = process.env.REACT_APP_AUTH0_AUDIENCE || '';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);
const AppWithProviders = () => (
  <BrowserRouter>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
      useRefreshTokens={false}
      cacheLocation="localstorage"
    >
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Auth0Provider>
  </BrowserRouter>
);

// Using type assertion to fix TypeScript compatibility issue
// Note: StrictMode is disabled to prevent double API calls in development
// StrictMode intentionally double-invokes components to detect side effects
// In production builds, this won't be an issue
root.render(
  React.createElement(AppWithProviders)
);

