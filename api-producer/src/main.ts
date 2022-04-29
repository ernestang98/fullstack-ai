import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {  
  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.listen(PORT).then(() => {
    console.log(`Rest API listening on ${PORT} for requests from client to add tasks to message queue...`)
  });
}
bootstrap();
