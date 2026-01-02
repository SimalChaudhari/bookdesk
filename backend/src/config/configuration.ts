/**
 * Application Configuration
 * Centralized configuration management with proper typing and validation
 */

export interface DatabaseConfig {
  readonly type: 'sqlite' | 'postgres' | 'mysql';
  readonly database: string;
  readonly synchronize: boolean;
  readonly logging: boolean;
}

export interface GraphQLConfig {
  readonly autoSchemaFile: string;
  readonly sortSchema: boolean;
  readonly playground: boolean;
  readonly introspection: boolean;
}

export interface Auth0Config {
  readonly issuerUrl: string;
  readonly audience: string;
  readonly jwksUri: string;
  readonly algorithms: string[];
  readonly jwksRequestsPerMinute: number;
}

export interface CorsConfig {
  readonly origin: string | string[];
  readonly credentials: boolean;
}

export interface ServerConfig {
  readonly port: number;
  readonly environment: 'development' | 'production' | 'test';
  readonly isVercel: boolean;
}

export interface ApplicationConfig {
  readonly server: ServerConfig;
  readonly database: DatabaseConfig;
  readonly graphql: GraphQLConfig;
  readonly auth0: Auth0Config;
  readonly cors: CorsConfig;
}

/**
 * Environment variable constants
 */
const ENVIRONMENT_VARIABLES = {
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  VERCEL: 'VERCEL',
  FRONTEND_URL: 'FRONTEND_URL',
  DATABASE_PATH: 'DATABASE_PATH',
  AUTH0_ISSUER_URL: 'AUTH0_ISSUER_URL',
  AUTH0_AUDIENCE: 'AUTH0_AUDIENCE',
} as const;

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  PORT: 4000,
  FRONTEND_URL: 'http://localhost:3000',
  DATABASE_PATH: 'books.db',
  DATABASE_TYPE: 'sqlite' as const,
  DATABASE_SYNCHRONIZE: true,
  DATABASE_LOGGING: false,
  GRAPHQL_SCHEMA_PATH: 'src/schema.gql',
  GRAPHQL_TEMP_SCHEMA_PATH: '/tmp/schema.gql',
  GRAPHQL_TEMP_DATABASE_PATH: '/tmp/books.db',
  AUTH0_ALGORITHMS: ['RS256'] as const,
  AUTH0_JWKS_REQUESTS_PER_MINUTE: 5,
  SERVER_ENVIRONMENT_DEVELOPMENT: 'development',
  SERVER_ENVIRONMENT_PRODUCTION: 'production',
  SERVER_ENVIRONMENT_TEST: 'test',
} as const;

/**
 * Validates required environment variables
 */
function validateEnvironmentVariables(): void {
  const requiredVars = [
    ENVIRONMENT_VARIABLES.AUTH0_ISSUER_URL,
    ENVIRONMENT_VARIABLES.AUTH0_AUDIENCE,
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
 * Gets server configuration
 */
function getServerConfig(): ServerConfig {
  const isVercel = Boolean(process.env[ENVIRONMENT_VARIABLES.VERCEL]);
  const nodeEnv = process.env[ENVIRONMENT_VARIABLES.NODE_ENV] || 
    DEFAULT_CONFIG.SERVER_ENVIRONMENT_DEVELOPMENT;
  
  const environment = (
    nodeEnv === DEFAULT_CONFIG.SERVER_ENVIRONMENT_PRODUCTION ||
    nodeEnv === DEFAULT_CONFIG.SERVER_ENVIRONMENT_TEST
      ? nodeEnv
      : DEFAULT_CONFIG.SERVER_ENVIRONMENT_DEVELOPMENT
  ) as 'development' | 'production' | 'test';

  const port = parseInt(
    process.env[ENVIRONMENT_VARIABLES.PORT] || 
    String(DEFAULT_CONFIG.PORT),
    10,
  );

  return {
    port,
    environment,
    isVercel,
  };
}

/**
 * Gets database configuration
 */
function getDatabaseConfig(serverConfig: ServerConfig): DatabaseConfig {
  const databasePath = serverConfig.isVercel
    ? DEFAULT_CONFIG.GRAPHQL_TEMP_DATABASE_PATH
    : process.env[ENVIRONMENT_VARIABLES.DATABASE_PATH] || 
      DEFAULT_CONFIG.DATABASE_PATH;

  return {
    type: DEFAULT_CONFIG.DATABASE_TYPE,
    database: databasePath,
    synchronize: DEFAULT_CONFIG.DATABASE_SYNCHRONIZE,
    logging: DEFAULT_CONFIG.DATABASE_LOGGING,
  };
}

/**
 * Gets GraphQL configuration
 */
function getGraphQLConfig(serverConfig: ServerConfig): GraphQLConfig {
  const autoSchemaFile = serverConfig.isVercel
    ? DEFAULT_CONFIG.GRAPHQL_TEMP_SCHEMA_PATH
    : DEFAULT_CONFIG.GRAPHQL_SCHEMA_PATH;

  const isDevelopment = serverConfig.environment === DEFAULT_CONFIG.SERVER_ENVIRONMENT_DEVELOPMENT;

  return {
    autoSchemaFile,
    sortSchema: true,
    playground: isDevelopment,
    introspection: isDevelopment,
  };
}

/**
 * Gets Auth0 configuration
 */
function getAuth0Config(): Auth0Config {
  const issuerUrl = process.env[ENVIRONMENT_VARIABLES.AUTH0_ISSUER_URL]!;
  const audience = process.env[ENVIRONMENT_VARIABLES.AUTH0_AUDIENCE]!;

  return {
    issuerUrl,
    audience,
    jwksUri: `${issuerUrl}/.well-known/jwks.json`,
    algorithms: [...DEFAULT_CONFIG.AUTH0_ALGORITHMS],
    jwksRequestsPerMinute: DEFAULT_CONFIG.AUTH0_JWKS_REQUESTS_PER_MINUTE,
  };
}

/**
 * Gets CORS configuration
 */
function getCorsConfig(): CorsConfig {
  const frontendUrl = process.env[ENVIRONMENT_VARIABLES.FRONTEND_URL] || 
    DEFAULT_CONFIG.FRONTEND_URL;

  // Support multiple origins (comma-separated)
  const origin = frontendUrl.includes(',')
    ? frontendUrl.split(',').map((url) => url.trim())
    : frontendUrl;

  return {
    origin,
    credentials: true,
  };
}

/**
 * Main configuration factory
 * Validates environment and returns complete application configuration
 */
export function getApplicationConfig(): ApplicationConfig {
  validateEnvironmentVariables();

  const serverConfig = getServerConfig();
  const databaseConfig = getDatabaseConfig(serverConfig);
  const graphqlConfig = getGraphQLConfig(serverConfig);
  const auth0Config = getAuth0Config();
  const corsConfig = getCorsConfig();

  return {
    server: serverConfig,
    database: databaseConfig,
    graphql: graphqlConfig,
    auth0: auth0Config,
    cors: corsConfig,
  };
}

/**
 * Configuration constants export
 */
export const CONFIG_CONSTANTS = {
  ENVIRONMENT_VARIABLES,
  DEFAULT_CONFIG,
} as const;

