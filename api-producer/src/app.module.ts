import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PredictionController } from './prediction/prediction.controller';
import { PredictionService } from './prediction/prediction.service';
import { PredictionModule } from './prediction/prediction.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TrainController } from './train/train.controller';
import { TrainService } from './train/train.service';
import { TrainModule } from './train/train.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQModule } from './rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/env/.env.${process.env.NODE_ENV}`
    }),
    UsersModule,
    MongooseModule.forRoot(process.env.MONGODB),
    PredictionModule,
    MulterModule.register({
      dest: './files',
      limits: { fieldSize: 250 * 10000 * 10000 }
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'),
    }),
    TrainModule,
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
