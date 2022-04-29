import { Controller,Get,Post,UseInterceptors,UploadedFile,Param,Body} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Helper, ID } from '../helper';
import { PredictionService } from './prediction.service';
import { RabbitMQService } from 'src/rabbitmq.service';
import { EventPattern } from '@nestjs/microservices';


@Controller('/predict')
export class PredictionController {

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly predictionService: PredictionService, ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: Helper.customFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file, @Body('name') name: string, @Body('image_str') image_str: string) {

    let id = ID();
    let filename = `${id}.jpeg`;
    let base64Data = image_str.substring(image_str.indexOf(",")+1)
    await require("fs").writeFile(`./files/${filename}`, base64Data, 'base64', function(err) {
      // console.log(err);
    });

    await this.predictionService.create(name, filename, "NONE", "PENDING", id);

    this.rabbitMQService.send('cz4171', JSON.stringify({
      type: "PREDICT",
      data: {
        "name": name,
        "file": image_str,
        "uuid": id,
        "filename": filename
      }
    }));

    return {
      "status": "Success! Sent prediction task to RabbitMQ! Proceed to dashboard to view results!"
    };

  }

  @Get('filter')
  async findAll(): Promise<any> {
    return this.predictionService.findAll();
  }

  @Get('filter/:user_id')
  async findSome(@Param('user_id') user_id): Promise<any> {
    if (user_id === undefined || user_id === null) {
      return this.predictionService.findAll();
    }
    else {
      return this.predictionService.findSome(user_id);
    }
  }

  @Get('TEST')
  async TEST() {
    this.rabbitMQService.send('TEST', JSON.stringify({
      type: "TEST",
      data: "NOTHING"
    }));
    return "We have added {type: \"TEST\", data: \"NOTHING\"}!"
  }

}

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};