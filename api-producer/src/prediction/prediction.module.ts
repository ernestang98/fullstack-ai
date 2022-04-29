import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PredictionController } from './prediction.controller';
import { PredictionService } from './prediction.service'
import { MongooseModule } from '@nestjs/mongoose';
import { PredictionSchema } from './prediction.model';
import { RabbitMQModule } from '../rabbitmq.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'prediction', schema: PredictionSchema }]),
        HttpModule,
        RabbitMQModule
    ],
    controllers: [PredictionController],
    providers: [PredictionService],
})
export class PredictionModule {}
