import { Injectable } from '@nestjs/common';

@Injectable()
export class TrainService {
   getHello(): string {
    return 'Hello World from Train!';
  }
}
