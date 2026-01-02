import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { getApplicationConfig } from './config/configuration';
import { APP_CONSTANTS } from './common/constants/app.constants';

const logger = new Logger('Bootstrap');

/**
 * Bootstrap function - Initializes and starts the NestJS application
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = getApplicationConfig();
  
  app.enableCors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  });

  await app.listen(config.server.port);
  
  const serverUrl = await app.getUrl();
  logger.log(`Server running on ${serverUrl}`);
  logger.log(`GraphQL endpoint: ${serverUrl}${APP_CONSTANTS.ROUTES.GRAPHQL}`);
}

bootstrap().catch((error) => {
  logger.error('Failed to start application', error);
  process.exit(1);
});

