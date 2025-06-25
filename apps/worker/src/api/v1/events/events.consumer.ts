import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerMessage } from 'src/app.types';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { EventsService } from './events.service';
import { EventParams } from 'src/app.types';
import { UtilService } from 'src/util/util.service';
import { KAFKA_EVENTS } from 'src/app.types';
import { StatusParams, ReactionParams } from 'src/app.types';
import { EventPublisher } from './event.publisher';
@Injectable()
export class EventsConsumer implements OnModuleInit {
  constructor(
    private readonly consumer: ConsumerService,
    private readonly event: EventsService,
    private readonly util: UtilService,
    private readonly publisher: EventPublisher,
  ) {}

  async onModuleInit() {
    await this.consumer.consume(
      { topics: ['chat-events'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const messageJSON =
            (JSON.parse(
              message.value?.toString() || '{}',
            ) as ConsumerMessage<EventParams>) || null;
          null;

          if (!messageJSON || messageJSON === null) {
            console.warn('Message Body Required');
            return;
          }

          const { event, data } = messageJSON;

          const { messageId } = data;
          if (!(await this.util.checkMessageExist(messageId))) {
            this.publisher.registerNewEvent(messageJSON);
            console.warn(
              '[EVENT] Message object not found...pushing to pub/sub',
            );
          }

          console.log(message.value?.toString(), topic, partition);
          if (event === KAFKA_EVENTS.MESSAGE_REACTION) {
            await this.event.addUpdateReaction(data as ReactionParams);
          } else if (event === KAFKA_EVENTS.MESSAGE_STATUS) {
            await this.event.addUpdateStatus(data as StatusParams);
          } else if (event === KAFKA_EVENTS.MESSAGE_PINNED) {
            await this.event.tooglePin(data);
          } else if (event === KAFKA_EVENTS.MESSAGE_STARRED) {
            await this.event.toogleStar(data);
          }
        },
      },
    );
  }
}
