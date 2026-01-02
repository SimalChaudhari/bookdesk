/**
 * Application-wide constants
 * Centralized location for all constant values used throughout the application
 */

export const APP_CONSTANTS = {
  /**
   * API Routes
   */
  ROUTES: {
    GRAPHQL: '/graphql',
    HEALTH: '/health',
  },

  /**
   * Error Messages
   */
  ERROR_MESSAGES: {
    BOOK_NOT_FOUND: 'Book not found',
    BOOK_CREATE_FAILED: 'Failed to create book',
    BOOK_UPDATE_FAILED: 'Failed to update book',
    BOOK_DELETE_FAILED: 'Failed to delete book',
    UNAUTHORIZED: 'Unauthorized access',
    INVALID_TOKEN: 'Invalid authentication token',
    MISSING_AUTHORIZATION_HEADER: 'Missing authorization header',
  },

  /**
   * Validation Constraints
   */
  VALIDATION: {
    BOOK_NAME_MIN_LENGTH: 1,
    BOOK_NAME_MAX_LENGTH: 255,
    BOOK_DESCRIPTION_MIN_LENGTH: 1,
    BOOK_DESCRIPTION_MAX_LENGTH: 5000,
  },
} as const;

