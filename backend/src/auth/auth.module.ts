import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Auth0Strategy } from './strategies/auth0.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * AuthModule - Authentication module
 * 
 * Provides JWT authentication using Auth0 strategy.
 * Exports JwtAuthGuard and PassportModule for use in other modules.
 */
@Module({
  imports: [PassportModule],
  providers: [Auth0Strategy, JwtAuthGuard],
  exports: [PassportModule, JwtAuthGuard],
})
export class AuthModule {}

