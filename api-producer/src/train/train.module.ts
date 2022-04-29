import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TrainController } from './train.controller';
import { TrainService } from './train.service';
import { RabbitMQModule } from 'src/rabbitmq.module';

@Module({
    imports: [
        HttpModule,
        RabbitMQModule
    ],
    controllers: [TrainController],
    providers: [TrainService],
})
export class TrainModule {}
