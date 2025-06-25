import { Injectable } from '@nestjs/common';
import { PUB_SUB_EVENT } from 'src/app.types';
import { PubService } from 'src/redis/pub/pub.service';

@Injectable()
export class ChatPublisher {
  constructor(private readonly publisher: PubService) {}
  async executeEvent(id: string) {
    return await this.publisher.publish(
      PUB_SUB_EVENT.REGISTER_EVENT,
      JSON.stringify(id),
    );
  }
}
