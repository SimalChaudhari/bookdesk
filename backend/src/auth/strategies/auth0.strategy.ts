import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

export interface JwtPayload {
  sub: string;
  email?: string;
  'https://your-auth0-domain.com/roles'?: string[];
}

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy) {
  constructor() {
    const issuerUrl = process.env.AUTH0_ISSUER_URL;
    const audience = process.env.AUTH0_AUDIENCE;

    if (!issuerUrl) {
      throw new Error('AUTH0_ISSUER_URL environment variable is required');
    }
    if (!audience) {
      throw new Error('AUTH0_AUDIENCE environment variable is required');
    }

    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${issuerUrl}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: audience,
      issuer: `${issuerUrl}/`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}

