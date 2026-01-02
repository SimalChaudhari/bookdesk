import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { getApplicationConfig } from '../../config/configuration';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { APP_CONSTANTS } from '../../common/constants/app.constants';

/**
 * Auth0Strategy - Passport strategy for Auth0 JWT authentication
 * 
 * Validates JWT tokens issued by Auth0 using JWKS (JSON Web Key Set).
 * Implements proper token validation and error handling.
 */
@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const config = getApplicationConfig();
    const auth0Config = config.auth0;

    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: auth0Config.jwksRequestsPerMinute,
        jwksUri: auth0Config.jwksUri,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: auth0Config.audience,
      issuer: `${auth0Config.issuerUrl}/`,
      algorithms: auth0Config.algorithms,
    });
  }

  /**
   * Validates the JWT payload after token verification
   * 
   * @param payload - Decoded JWT payload
   * @returns Validated payload
   * @throws UnauthorizedException if payload is invalid
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException(APP_CONSTANTS.ERROR_MESSAGES.INVALID_TOKEN);
    }

    return payload;
  }
}

