import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { BookModule } from './book/book.module';
import { AuthModule } from './auth/auth.module';
import { Book } from './book/entities/book.entity';
import { ConfigModule as AppConfigModule } from './config/config.module';
import { getApplicationConfig } from './config/configuration';

/**
 * AppModule - Main application module
 * GraphQL API with TypeORM and SQLite
 * 
 * This module serves as the root module of the application,
 * configuring all core services including database, GraphQL, and authentication.
 */
@Module({
  imports: [
    // Global configuration module
    AppConfigModule,
    
    // Database configuration using TypeORM
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const config = getApplicationConfig();
        return {
          type: config.database.type,
          database: config.database.database,
          entities: [Book],
          synchronize: config.database.synchronize,
          logging: config.database.logging,
        };
      },
    }),
    
    // GraphQL configuration
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => {
        const config = getApplicationConfig();
        // Use in-memory schema generation on Vercel, file-based for local development
        const autoSchemaFile = config.graphql.autoSchemaFile === true
          ? true
          : join(process.cwd(), config.graphql.autoSchemaFile);
        
        return {
          autoSchemaFile,
          sortSchema: config.graphql.sortSchema,
          playground: config.graphql.playground,
          introspection: config.graphql.introspection,
          context: ({ req }) => ({ req }),
        };
      },
    }),
    
    // Feature modules
    BookModule,
    AuthModule,
  ],
})
export class AppModule {}

