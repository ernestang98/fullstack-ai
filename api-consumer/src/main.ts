import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport} from '@nestjs/microservices';
import * as session from 'express-session';

async function bootstrap() {  
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ],
      queue: 'cz4171-rabbitmq-queue',
      queueOptions: { durable: false },
      noAck: false
    },
  })
  app.listen().then(() => {
    console.log("Consumer microservice listening for tasks added to message queue...")
  }); 
}

bootstrap();
