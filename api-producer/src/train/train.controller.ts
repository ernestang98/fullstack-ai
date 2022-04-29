import {
    Controller,
    Post,
    Body,
    Get,
    UseInterceptors,
  } from '@nestjs/common';

import { TrainService } from './train.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Helper } from '../helper';
import { RabbitMQService } from 'src/rabbitmq.service';


@Controller('train')
export class TrainController {

    constructor(
      private readonly trainService: TrainService, 
      private readonly rabbitMQService: RabbitMQService,) {}

    @Get()
    async findAll(): Promise<any> {
        return this.trainService.getHello();
    }

    @Post()
    @UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: './files',
          filename: Helper.customFileName,
        }),
      }),
    )
    async trainModel(@Body('cat') cat: string, @Body('file') image_str: string) {

      this.rabbitMQService.send('cz4171', JSON.stringify({
        type: "TRAIN",
        data: {
          "cat": cat,
          "image_str": image_str
        }
      }));
  
      return {
        "status": "Success! Sent training task to RabbitMQ!"
      };

    }

}
