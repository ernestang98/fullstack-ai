import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { PredictionSchema } from './prediction.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/env/.env.${process.env.NODE_ENV}`
    }),
    HttpModule,
    MongooseModule.forRoot(process.env.MONGODB),
    MongooseModule.forFeature([{ name: 'prediction', schema: PredictionSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
