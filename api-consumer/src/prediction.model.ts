import * as moongose from 'mongoose';

export const PredictionSchema = new moongose.Schema({
    name: String,
    image_path: String,
    date_submitted: Date,
    prediction: String,
    status: String,
    uuid: String,
});

export interface Prediction extends moongose.Document {
    name: string,
    image_path: string,
    date_submitted: Date,
    prediction: string, 
    status: string, // PENDING | DONE
    uuid: string
}