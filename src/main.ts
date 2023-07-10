import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Tutorials API')
    .setDescription(
      'Tutorials API is designed to serve data to the FE team. If you see a lock on an endpoint, please make sure to provide a bearer token',
    )
    .addBearerAuth({
      type: 'http',
      description: 'Bearer <your-token>',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
