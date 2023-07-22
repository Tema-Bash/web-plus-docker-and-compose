import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const corsOptions = {
    origin: configService.get<string | string[]>('allowedOrigins'),
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['authorization', 'content-type'],
  };
  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe());
  const PORT = 3000
  await app.listen(PORT);
}

bootstrap().then(() => console.log('Started'));
