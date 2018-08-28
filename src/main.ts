import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import * as express from 'express';

import { AppModule } from './app.module';
import updateEnv from './update-env';
import { ValidatorPipe } from './validator.pipe';

async function bootstrap() {
  config();

  await updateEnv();

  const expressInstance = express();
  expressInstance.use(express.static('public'));
  expressInstance.use(express.static('webapp/dist'));

  const app = await NestFactory.create(AppModule, expressInstance, { cors: true });

  app.useGlobalPipes(new ValidatorPipe());

  await app.listen(process.env.API_PORT);
}

bootstrap();
