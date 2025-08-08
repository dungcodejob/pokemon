import { AppConfig, appConfig } from '@app/configs';
import fastifyCors from '@fastify/cors';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const appConfigValues = app.get<AppConfig>(appConfig.KEY);

  app.register(fastifyCors, {
    credentials: true,
    origin: appConfigValues.client,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );

  const port = appConfigValues.port;
  const domain = appConfigValues.domain;
  const testing = appConfigValues.testing;

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Pokemon API')
    .setDescription('An Pokemon API made with NestJS')
    .setVersion('0.0.1')
    .addBearerAuth()
    .addTag('Pokemon API')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port, testing ? '127.0.0.1' : '0.0.0.0');

  console.log(`Server in ${process.env.NODE_ENV} mode`);
  console.log(`Server is listening on :${port}/${globalPrefix}`);
  console.log(`Swagger: ${domain}/${globalPrefix}/docs`);
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
