import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { API_VERSION } from './utils/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const basePrefix = `/api/${API_VERSION}`;

  app.setGlobalPrefix(basePrefix);
  const config = new DocumentBuilder()
    .setTitle('Nestjs RealWorld App')
    .setDescription('The RealWorld API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3005);
}
bootstrap();
