import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * JwtAuthGuard - JWT authentication guard for GraphQL
 * Protects GraphQL queries and mutations with Auth0 JWT tokens
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    
    // Log for debugging
    if (!req.headers.authorization) {
      console.error('[JwtAuthGuard] No authorization header found in request');
    }
    
    return req;
  }
  
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      console.error('[JwtAuthGuard] Authentication failed:', err || info);
      throw err || new Error(info?.message || 'Unauthorized');
    }
    return user;
  }
}

