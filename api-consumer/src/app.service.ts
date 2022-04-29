import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prediction } from './prediction.model';

const MODEL_ENDPOINT = "CHANGE ME"

@Injectable()
export class AppService {

  constructor(
    @InjectModel('prediction') private readonly predModel: Model<Prediction>,
    private readonly http: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async performInference(data: any) {
    if (data["type"] === "PREDICT") {
      const response = await firstValueFrom(this.http.post(MODEL_ENDPOINT, {
        "file": data["data"]["file"]
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      }));
  
      let prediction = response["data"]["prediction"]
      const res = await this.predModel.findOneAndUpdate({ uuid: data["data"]["uuid"] }, { status: "DONE", prediction }, {
        new: true
      });

      return res
    }
    else if (data["type"] === "TRAIN") {
      const response = await firstValueFrom(this.http.post(MODEL_ENDPOINT + "train", {
        "file": data["data"]["image_str"],
        "cat": data["data"]["cat"]
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      }));
      let res = response["data"]["status"]
      return res;
    }
    else {
      return "hotfix"
    }
  }
}
