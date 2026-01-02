import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { BookModule } from './book/book.module';
import { AuthModule } from './auth/auth.module';
import { Book } from './book/entities/book.entity';

/**
 * AppModule - Main application module
 * GraphQL API with TypeORM and SQLite
 */
@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // Use /tmp directory on Vercel (only writable location in serverless)
      // Note: Data will be lost on each deployment - use Railway/Render for persistence
      database: process.env.VERCEL 
        ? '/tmp/books.db' 
        : process.env.DATABASE_PATH || 'books.db',
      entities: [Book],
      synchronize: true, // For development only
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // Use /tmp for schema file on Vercel (only writable location)
      autoSchemaFile: process.env.VERCEL 
        ? '/tmp/schema.gql' 
        : join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }) => ({ req }),
    }),
    BookModule,
    AuthModule,
  ],
})
export class AppModule {}

