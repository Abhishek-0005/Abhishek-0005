import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  app.use(helmet());

  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
  app.enableCors({ origin: corsOrigin, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
}
bootstrap();
