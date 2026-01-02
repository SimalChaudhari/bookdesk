/**
 * Authentication-related TypeScript types and interfaces
 */

export interface Auth0Error {
  readonly message: string;
  readonly error?: string;
  readonly error_description?: string;
}

export interface Auth0User {
  readonly sub: string;
  readonly email?: string;
  readonly name?: string;
  readonly picture?: string;
}

