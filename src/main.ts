import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { configSwagger } from './configs/setup-swagger';
import { ERRORS_DICTIONARY } from './constraints/error-dictionary.constraint';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';
import { UsersService } from './modules/users/users.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {});
  const configService = app.select(SharedModule).get(ApiConfigService);

  const port = configService.serverConfig.port;

  if (configService.documentationEnabled) {
    configSwagger(app);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new BadRequestException({
          message: ERRORS_DICTIONARY.VALIDATION_ERROR,
          details: errors.map((error) => Object.values(error.constraints)).flat()
        })
    })
  );

  await app.listen(port);

  logger.log(`🚀 Server running on: http://localhost:${port}/api-docs`);
}

async function initData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UsersService);
  await userService.createInitialUser();

  await app.close();
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to bootstrap the application', error); // Log any errors that occur during bootstrap
});

initData(); 
