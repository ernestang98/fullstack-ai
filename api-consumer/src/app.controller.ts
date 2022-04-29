import { Controller, Get, Req } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import {
  MessagePattern,
  RmqContext,
  Ctx,
  Payload,
  EventPattern,
} from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly http: HttpService) {}

  @EventPattern('cz4171')
  public async execute(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    data = JSON.parse(data)
    channel.ack(originalMsg);
    const res = await this.appService.performInference(data);
    if (res  !== "hotfix") {
      console.log("Inference complete, response: " + JSON.stringify(res))
    }
  }

  @EventPattern('TEST')
  async TEST(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log(`Testing message consumed: ${data}`)
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

}
