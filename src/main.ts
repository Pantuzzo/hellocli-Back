import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { exec } from 'child_process';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'https://https://hellocli.netlify.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Ativa a validação global com class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Remove propriedades não existentes no DTO
      forbidNonWhitelisted: true, // Retorna erro se enviar algo fora do DTO
      transform: true,            // Transforma os dados no tipo correto do DTO
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('AI Chat Backend API')
    .setDescription('API para sistema de chatbot com integração OpenAI')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await await app.listen(process.env.PORT || 3000);
  
  exec('start http://localhost:3000/docs/');
}
bootstrap();
