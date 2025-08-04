import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3030',
  'https://hellocli.netlify.app',
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativa o CORS para múltiplas origens
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Configura Swagger (ativo em todos os ambientes)
  const config = new DocumentBuilder()
    .setTitle('HelloCli API')
    .setDescription('Documentação da API do HelloCli')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Inicializa servidor na porta definida
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 App is running on: http://localhost:${port}`);
  console.log(`📄 Swagger docs available at: http://localhost:${port}/docs`);
}
bootstrap();
