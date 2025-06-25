import { Injectable } from '@nestjs/common';
import { EventParams, ConsumerMessage, PUB_SUB_EVENT } from 'src/app.types';
import { PubService } from 'src/redis/pub/pub.service';

@Injectable()
export class EventPublisher {
  constructor(private readonly publisher: PubService) {}

  async registerNewEvent(message: ConsumerMessage<EventParams>) {
    return await this.publisher.publish(
      PUB_SUB_EVENT.REGISTER_EVENT,
      JSON.stringify(message),
    );
  }
}
