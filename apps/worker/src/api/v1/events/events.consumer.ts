import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerMessage } from 'src/app.types';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { EventsService } from './events.service';
import { EventParams } from 'src/app.types';
import { UtilService } from 'src/util/util.service';

@Injectable()
export class EventsConsumer implements OnModuleInit {
  constructor(
    private readonly consumer: ConsumerService,
    private readonly event: EventsService,
    private readonly util: UtilService,
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
            return;
          }
          console.log(message.value?.toString(), topic, partition);
          // if (event === KAFKA_EVENTS.MESSAGE_CREATE) {
          //   this.chat.addMessage({
          //     message: messageJSON.data,
          //   });
          // } else if (event === KAFKA_EVENTS.MESSAGE_DELETE) {
          //   this.chat.deleteMessage({
          //     messageId: messageJSON.data.id,
          //     userId: messageJSON.userId,
          //   });
          // } else if (event === KAFKA_EVENTS.MESSAGE_UPDATE) {
          //   this.chat.updateMessage({
          //     messageId: messageJSON.data.id,
          //     userId: messageJSON.userId,
          //     content: messageJSON.data.content,
          //   });
          // }
        },
      },
    );
  }
}
