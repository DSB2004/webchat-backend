import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventParams, ConsumerMessage } from 'src/app.types';
import { redis } from '@webchat-backend/redis';
import { SubService } from 'src/redis/sub/sub.service';
import { KAFKA_EVENTS, PUB_SUB_EVENT } from 'src/app.types';
import { EventsProducer } from './events.producer';
@Injectable()
export class EventSubscriber implements OnModuleInit {
  constructor(
    private readonly producer: EventsProducer,
    private readonly subscriber: SubService,
  ) {}

  private REDIS_KEY = (messageId: string) => 'message.event.' + messageId;

  private async fetchMessageEvents(
    messageId: string,
  ): Promise<ConsumerMessage[]> {
    const key = this.REDIS_KEY(messageId);
    const items = await redis.lrange(key, 0, -1);
    return items.map((item) => JSON.parse(item));
  }
  private async clearMessageEvents(messageId: string) {
    const key = this.REDIS_KEY(messageId);
    await redis.del(key);
  }

  private async registerMessageEvent(data: ConsumerMessage) {
    const key = this.REDIS_KEY(data.messageId);
    await redis.rpush(key, JSON.stringify(data));
  }

  private async execute(id: string) {
    try {
      const eventList = await this.fetchMessageEvents(id);
      for (const event_ of eventList) {
        const { event } = event_;
        switch (event) {
          case KAFKA_EVENTS.MESSAGE_REACTION:
            await this.producer.addOrUpdateReaction({ message: event_ });
          case KAFKA_EVENTS.MESSAGE_STATUS:
            await this.producer.addOrUpdateStatus({ message: event_ });
          case KAFKA_EVENTS.MESSAGE_STARRED:
            await this.producer.toggleStarred({ message: event_ });
          case KAFKA_EVENTS.MESSAGE_PINNED:
            await this.producer.tooglePinned({ message: event_ });
        }
        await this.clearMessageEvents(id);
        return true;
      }
    } catch (err) {
      return false;
    }
  }

  async onModuleInit() {
    this.subscriber.subscribe(
      PUB_SUB_EVENT.REGISTER_EVENT,
      this.registerMessageEvent.bind(this),
    );

    this.subscriber.subscribe(
      PUB_SUB_EVENT.EXECUTE,
      async (id: string) => await this.execute(id),
    );
  }
}
