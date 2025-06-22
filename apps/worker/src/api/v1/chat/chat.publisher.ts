import { Injectable } from '@nestjs/common';
import { EventParams, ConsumerMessage, PUB_SUB_EVENT } from 'src/app.types';
import { PubService } from 'src/redis/pub/pub.service';

@Injectable()
export class ChatPublsiher extends PubService {
  async executeEvent(id: string) {
    return await this.publish(PUB_SUB_EVENT.REGISTER_EVENT, JSON.stringify(id));
  }
}
