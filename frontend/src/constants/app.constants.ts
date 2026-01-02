/**
 * Application-wide constants
 * Centralized location for all constant values used throughout the application
 */

export const APP_CONSTANTS = {
  /**
   * Routes
   */
  ROUTES: {
    HOME: '/',
    LOGIN: '/login',
  },

  /**
   * Error Messages
   */
  ERROR_MESSAGES: {
    AUTH_ERROR: 'Authentication error occurred',
    AUTH_INVALID_STATE: 'Invalid authentication state',
    AUTH_NO_TOKEN: 'No access token available',
    BOOK_LOAD_ERROR: 'Failed to load books',
    BOOK_CREATE_ERROR: 'Failed to create book',
    BOOK_UPDATE_ERROR: 'Failed to update book',
    BOOK_DELETE_ERROR: 'Failed to delete book',
    NETWORK_ERROR: 'Network error occurred',
    GRAPHQL_ERROR: 'GraphQL error occurred',
    ROOT_ELEMENT_NOT_FOUND: 'Root element not found',
  },

  /**
   * UI Messages
   */
  UI_MESSAGES: {
    AUTH_ERROR_TITLE: 'Authentication Error',
    AUTH_ERROR_DESCRIPTION: 'Please try signing in again. If the problem persists, clear your browser cache.',
    CLEAR_CACHE: 'Clear Cache & Retry',
    RELOAD_PAGE: 'Reload Page',
  },

  /**
   * Storage Keys
   */
  STORAGE_KEYS: {
    LOCAL_STORAGE: 'localStorage',
    SESSION_STORAGE: 'sessionStorage',
  },

  /**
   * Apollo Client Settings
   */
  APOLLO: {
    BEARER_PREFIX: 'Bearer ',
  },
} as const;

