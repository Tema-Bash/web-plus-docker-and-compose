import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const corsOptions = {
    origin: ['http://anf.nomoredomains.xyz', 'https://anf.nomoredomains.xyz'],
    // origin: ['http://localhost:3000', 'https://localhost:3000'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['authorization', 'content-type'],
  };
  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(3000);
}
bootstrap().then(() => console.log('Started'));
