import { Injectable } from '@nestjs/common';
import { db, StatusType } from '@webchat-backend/db';
import { UtilService } from 'src/util/util.service';
import { EventParams, ConsumerMessage } from 'src/app.types';
import { redis } from '@webchat-backend/redis';
import { SubService } from 'src/redis/sub/sub.service';
import { EventsProducer } from './events.producer';
@Injectable()
export class EventSubscriber extends SubService {
  constructor(private readonly producer: EventsProducer) {
    super();
  }

  private REDIS_KEY = (messageId: string) => 'message.event.' + messageId;

  private async fetchMessageEvents(
    messageId: string,
  ): Promise<ConsumerMessage<EventParams>[]> {
    const key = this.REDIS_KEY(messageId);
    const items = await redis.lrange(key, 0, -1);
    return items.map((item) => JSON.parse(item));
  }
  private async clearMessageEvents(messageId: string) {
    const key = this.REDIS_KEY(messageId);
    await redis.del(key);
  }

  private async registerMessageEvent(data: ConsumerMessage<EventParams>) {
    const key = this.REDIS_KEY(data.data.messageId);
    await redis.rpush(key, JSON.stringify(data));
  }

  private async execute(id: string) {
    try {
      const eventList = await this.fetchMessageEvents(id);
        for (const event of eventList) {
          
      }
    } catch (err) {}
  }
}
