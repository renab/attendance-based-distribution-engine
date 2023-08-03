import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { AppModule } from './modules/app/app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('App');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.setViewEngine('hbs');
  app.set('view options', { layout: 'main' });
  await app.listen(process.env.APP_PORT);
  logger.log(`Application started on port ${process.env.APP_PORT}`);
}
bootstrap();
