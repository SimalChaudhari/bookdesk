/**
 * JWT Payload Interface
 * Defines the structure of the JWT token payload from Auth0
 */
export interface JwtPayload {
  /**
   * Subject - Unique identifier for the user
   */
  readonly sub: string;

  /**
   * User email address
   */
  readonly email?: string;

  /**
   * User roles (Auth0 custom claim)
   * Format: https://your-auth0-domain.com/roles
   */
  readonly 'https://your-auth0-domain.com/roles'?: string[];

  /**
   * Token issuer
   */
  readonly iss?: string;

  /**
   * Token audience
   */
  readonly aud?: string;

  /**
   * Token expiration time (Unix timestamp)
   */
  readonly exp?: number;

  /**
   * Token issued at time (Unix timestamp)
   */
  readonly iat?: number;
}

