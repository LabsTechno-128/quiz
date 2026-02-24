import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = process.env.PORT || 8000;
  const app = await NestFactory.create(AppModule);
  // console.log(process.env.PORT, 'MAMAR BARIR ABDAR');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove another property who not define in dto
      forbidNonWhitelisted: true, // unknown property trhow error
      transform: true, // payload  make dto instance
    }),
  );

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    // origin: 'http://localhost:3000',
    origin: [
      'https://thinkhive.net',
      'https://www.thinkhive.net',
      'http://localhost:3000',
      'https://admin.thinkhive.net/login',
      'https://www.admin.thinkhive.net/login',
      'http://localhost:3001',
      'http://localhost:4000',
      'http://localhost:3002',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });
  await app.listen(PORT);
  console.log(`🚀 App running on http://localhost:${PORT}`);
}

bootstrap().catch((err) => {
  console.error('❌ Error during app bootstrap', err);
  process.exit(1); // optional: exit process if boot fails
});
