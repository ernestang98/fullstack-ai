import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello World! It is ${process.env.TEST === "test"} that I am working...`;
  }
}
