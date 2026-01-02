import type { FetchPolicy } from '@apollo/client';

/**
 * Application Configuration
 * Centralized configuration management with proper typing and validation
 */

export interface Auth0Config {
  readonly domain: string;
  readonly clientId: string;
  readonly audience: string;
  readonly redirectUri: string;
  readonly useRefreshTokens: boolean;
  readonly cacheLocation: 'localstorage' | 'memory';
}

export interface ApolloConfig {
  readonly graphqlUrl: string;
  readonly fetchPolicy: FetchPolicy;
  readonly queryDeduplication: boolean;
}

export interface AppConfig {
  readonly auth0: Auth0Config;
  readonly apollo: ApolloConfig;
}

/**
 * Environment variable keys
 */
const ENV_KEYS = {
  AUTH0_DOMAIN: 'REACT_APP_AUTH0_DOMAIN',
  AUTH0_CLIENT_ID: 'REACT_APP_AUTH0_CLIENT_ID',
  AUTH0_AUDIENCE: 'REACT_APP_AUTH0_AUDIENCE',
  GRAPHQL_URL: 'REACT_APP_GRAPHQL_URL',
} as const;

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  GRAPHQL_URL: 'http://localhost:4000/graphql',
  AUTH0_USE_REFRESH_TOKENS: false,
  AUTH0_CACHE_LOCATION: 'localstorage' as const,
  APOLLO_FETCH_POLICY: 'cache-first' as const,
  APOLLO_QUERY_DEDUPLICATION: true,
} as const;

/**
 * Validates required environment variables
 */
function validateEnvironmentVariables(): void {
  const requiredVars = [
    ENV_KEYS.AUTH0_DOMAIN,
    ENV_KEYS.AUTH0_CLIENT_ID,
    ENV_KEYS.AUTH0_AUDIENCE,
  ];

  const missingVars = requiredVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }
}

/**
 * Gets Auth0 configuration
 */
function getAuth0Config(): Auth0Config {
  const domain = process.env[ENV_KEYS.AUTH0_DOMAIN] || '';
  const clientId = process.env[ENV_KEYS.AUTH0_CLIENT_ID] || '';
  const audience = process.env[ENV_KEYS.AUTH0_AUDIENCE] || '';

  return {
    domain,
    clientId,
    audience,
    redirectUri: window.location.origin,
    useRefreshTokens: DEFAULT_CONFIG.AUTH0_USE_REFRESH_TOKENS,
    cacheLocation: DEFAULT_CONFIG.AUTH0_CACHE_LOCATION,
  };
}

/**
 * Gets Apollo Client configuration
 */
function getApolloConfig(): ApolloConfig {
  const graphqlUrl =
    process.env[ENV_KEYS.GRAPHQL_URL] || DEFAULT_CONFIG.GRAPHQL_URL;

  return {
    graphqlUrl,
    fetchPolicy: DEFAULT_CONFIG.APOLLO_FETCH_POLICY,
    queryDeduplication: DEFAULT_CONFIG.APOLLO_QUERY_DEDUPLICATION,
  };
}

/**
 * Main configuration factory
 * Validates environment and returns complete application configuration
 */
export function getAppConfig(): AppConfig {
  validateEnvironmentVariables();

  return {
    auth0: getAuth0Config(),
    apollo: getApolloConfig(),
  };
}

/**
 * Configuration constants export
 */
export const CONFIG_CONSTANTS = {
  ENV_KEYS,
  DEFAULT_CONFIG,
} as const;

