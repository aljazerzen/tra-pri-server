import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidatorPipe } from './validator.pipe';
import * as express from 'express';

async function bootstrap() {
  config();

  const expressInstance = express();
  expressInstance.use(express.static('public'));
  expressInstance.use(express.static('webapp/dist'));

  const app = await NestFactory.create(AppModule, expressInstance, { cors: true });

  app.useGlobalPipes(new ValidatorPipe());

  await app.listen(process.env.API_PORT);
}

bootstrap();
