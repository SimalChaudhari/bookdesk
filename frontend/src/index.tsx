import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import { getAppConfig } from './config/app.config';
import { APP_CONSTANTS } from './constants/app.constants';

/**
 * Application entry point
 * Initializes React application with all required providers
 */
function initializeApp(): void {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error(APP_CONSTANTS.ERROR_MESSAGES.ROOT_ELEMENT_NOT_FOUND);
  }

  const config = getAppConfig();
  const root = ReactDOM.createRoot(rootElement);

  const AppWithProviders = () => (
    <BrowserRouter>
      <Auth0Provider
        domain={config.auth0.domain}
        clientId={config.auth0.clientId}
        authorizationParams={{
          redirect_uri: config.auth0.redirectUri,
          audience: config.auth0.audience,
        }}
        useRefreshTokens={config.auth0.useRefreshTokens}
        cacheLocation={config.auth0.cacheLocation}
      >
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </Auth0Provider>
    </BrowserRouter>
  );

  root.render(React.createElement(AppWithProviders));
}

initializeApp();

