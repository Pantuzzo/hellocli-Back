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
  
    app.enableCors({
    origin: ['http://localhost:3000', 'https://hellocli.netlify.app'],
    credentials: true,
  });

  const config = new DocumentBuilder()
  .setTitle('HelloCli API')
  .setDescription('Documentação da API do HelloCli')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Insira o token JWT aqui',
      in: 'header',
    },
    'JWT-auth',
  )
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
