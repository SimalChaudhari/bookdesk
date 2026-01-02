import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Bootstrap function - Starts the NestJS application
 * Sets up CORS and starts the server
 * Note: GraphQL handles validation automatically, so ValidationPipe is not needed
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(process.env.PORT || 4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`GraphQL playground: ${await app.getUrl()}/graphql`);
}
bootstrap();

