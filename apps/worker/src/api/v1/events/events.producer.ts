import { Injectable } from '@nestjs/common';
import { ProducerService } from 'src/kafka/producer/producer.service';
import { KAFKA_EVENTS } from 'src/app.types';
@Injectable()
export class EventsProducer {
  constructor(private readonly producer: ProducerService) {}

  async tooglePinned({ message }: { message: any }) {
    try {
      const payload = {
        ...message,
        event: KAFKA_EVENTS.MESSAGE_PINNED,
      };
      await this.producer.produce({
        topic: 'chat-event',
        messages: [
          {
            key: payload.id,
            value: JSON.stringify(payload),
          },
        ],
      });
      return { status: 202, message: 'Message added to queue' };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }

  async toggleStarred({ message }: { message: any }) {
    try {
      const payload = {
        ...message,
        event: KAFKA_EVENTS.MESSAGE_STARRED,
      };
      await this.producer.produce({
        topic: 'chat-event',
        messages: [
          {
            key: payload.id,
            value: JSON.stringify(payload),
          },
        ],
      });
      return { status: 202, message: 'Message added to queue' };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }

  async addOrUpdateStatus({ message }: { message: any }) {
    try {
      const payload = {
        ...message,
        event: KAFKA_EVENTS.MESSAGE_STATUS,
      };
      await this.producer.produce({
        topic: 'chat-event',
        messages: [
          {
            key: payload.id,
            value: JSON.stringify(payload),
          },
        ],
      });
      return { status: 202, message: 'Message added to queue' };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }

  async addOrUpdateReaction({ message }: { message: any }) {
    try {
      const payload = {
        ...message,
        event: KAFKA_EVENTS.MESSAGE_REACTION,
      };
      await this.producer.produce({
        topic: 'chat-event',
        messages: [
          {
            key: payload.id,
            value: JSON.stringify(payload),
          },
        ],
      });
      return { status: 202, message: 'Message added to queue' };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
}
