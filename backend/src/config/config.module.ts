import { Module, Global } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { getApplicationConfig } from './configuration';

/**
 * Global Configuration Module
 * Provides centralized configuration access throughout the application
 */
@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [getApplicationConfig],
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}

