import { Injectable } from '@nestjs/common';
import { db, StatusType } from '@webchat-backend/db';
import { UtilService } from 'src/util/util.service';
import { EventParams, ConsumerMessage, PUB_SUB_EVENT } from 'src/app.types';
import { redis } from '@webchat-backend/redis';
import { PubService } from 'src/redis/pub/pub.service';

@Injectable()
export class EventPublsiher extends PubService {
  async registerNewEvent(message: ConsumerMessage<EventParams>) {
    return await this.publish(
      PUB_SUB_EVENT.REGISTER_EVENT,
      JSON.stringify(message),
    );
  }

  async executeEvent(id: string) {
    return await this.publish(PUB_SUB_EVENT.REGISTER_EVENT, JSON.stringify(id));
  }
}
