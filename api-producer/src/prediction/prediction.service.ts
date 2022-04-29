import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prediction } from './prediction.model';

@Injectable()
export class PredictionService {
    constructor(@InjectModel('prediction') private readonly predModel: Model<Prediction>) {}

    async create(name: string, image_path: string, prediction: string, status: string, uuid: string): Promise<Prediction> {
        const createdPrediction = new this.predModel({ name, image_path, prediction, status, date_submitted: new Date(), uuid });
        return createdPrediction.save();
    }

    async findAll(): Promise<Prediction[]> {
        return this.predModel.find().sort('-date_submitted').exec();
    }

    async findSome(userId?: String): Promise<Prediction[]> {
        userId = userId.replace("_", " ");
        return this.predModel.find({ name: userId }).sort('-date_submitted').exec();
    }
}
