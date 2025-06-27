import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ConsumerMessage,
  KAFKA_EVENTS,
  EventParams,
  StatusParams,
  ReactionParams,
} from 'src/app.types';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { EventsService } from './events.service';
import { UtilService } from 'src/util/util.service';
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
      'webchat-chat-events',
      { topics: ['chat-events'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const rawValue = message.value?.toString();
            if (!rawValue) {
              console.warn('⚠️ Empty message received');
              return;
            }

            const parsed: ConsumerMessage = JSON.parse(rawValue);

            if (!parsed || !parsed.event || !parsed.messageId) {
              console.warn('⚠️ Invalid event message format', parsed);
              return;
            }

            const { event, messageId, chatroomId } = parsed;

            console.log(
              `📨 Event: ${event} | Partition: ${partition} | Topic: ${topic}`,
            );

            const messageExists = await this.util.checkMessageExist(messageId);
            if (!messageExists) {
              console.warn(
                '[EVENT] Message not found. Registering for pub/sub...',
              );
              this.publisher.registerNewEvent(parsed);
              return;
            }

            switch (event) {
              case KAFKA_EVENTS.MESSAGE_REACTION:
                // @ts-ignore
                await this.event.addUpdateReaction(parsed as ReactionParams);
                break;

              case KAFKA_EVENTS.MESSAGE_STATUS:
                // @ts-ignore
                await this.event.addUpdateStatus(parsed as StatusParams);
                break;

              case KAFKA_EVENTS.MESSAGE_PINNED:
                await this.event.tooglePin(parsed);
                break;

              case KAFKA_EVENTS.MESSAGE_STARRED:
                await this.event.toogleStar(parsed);
                break;

              default:
                console.warn(`⚠️ Unknown event type: ${event}`);
            }
          } catch (err) {
            console.error('❌ Failed to process Kafka message:', err);
          }
        },
      },
    );
  }
}
