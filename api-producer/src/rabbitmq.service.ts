import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject('cz4171-rabbitmq-module') private readonly client: ClientProxy,
  ) {}
  public async send(pattern: string, data: any) {
    await this.client.emit(pattern, data).toPromise().then(res=> {
      this.client.close()
    })
  }
}