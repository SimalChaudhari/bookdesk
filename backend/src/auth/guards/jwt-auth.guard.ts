import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { APP_CONSTANTS } from '../../common/constants/app.constants';

/**
 * JwtAuthGuard - JWT authentication guard for GraphQL
 * 
 * Protects GraphQL queries and mutations with Auth0 JWT tokens.
 * Extracts the request from GraphQL context and validates authentication.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Extracts the HTTP request from GraphQL execution context
   * 
   * @param context - NestJS execution context
   * @returns HTTP request object
   */
  getRequest(context: ExecutionContext): Request {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().req;
  }

  /**
   * Handles authentication result
   * 
   * @param err - Error from authentication process
   * @param user - Authenticated user payload
   * @param info - Additional authentication information
   * @returns Authenticated user
   * @throws UnauthorizedException if authentication fails
   */
  handleRequest<TUser = any>(
    err: Error,
    user: TUser,
    info: any,
  ): TUser {
    if (err || !user) {
      const errorMessage = info?.message || APP_CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED;
      throw err || new UnauthorizedException(errorMessage);
    }

    return user;
  }
}

