import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidatorPipe } from './validator.pipe';

async function bootstrap() {
  config();

  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidatorPipe());

  await app.listen(process.env.API_PORT);
}

bootstrap();
