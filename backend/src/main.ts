// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // මේක මේ විදිහටම දාන්න (සියලුම origins වලට ඉඩ දෙන්න)
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(3001);
  console.log('Backend is running on http://localhost:3001');
}
bootstrap();