import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Add Global Prefix
  app.setGlobalPrefix('api');

  // Enable Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Nest Nest Starter Api')
    .setDescription('Nest Nest Starter Api Documentation')
    .setVersion('1.0.0')
    .addTag('nest-nest-starter-api')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationSorter: 'alpha',
    },
    customSiteTitle: 'Next Nest Starter Api',
  });

  // Global Interceptor (for class-transformer)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(cookieParser());

  // CORS configuration
  app.enableCors({
    origin: [
      '*',
      'http://localhost:3000',
      'https://tripwheel.vercel.app',
      'https://tripwheel.netlify.app',
      'https://kz5xbsbg-3000.asse.devtunnels.ms',
      configService.getOrThrow<string>('FRONTEND_URL'),
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
    ],
    exposedHeaders: ['Content-Disposition', 'Content-Type', 'Content-Length'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  const PORT = configService.get<number>('SERVER_PORT') || 50001;
  await app.listen(PORT);

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger UI available at: ${await app.getUrl()}/api-docs`);
}
bootstrap();
