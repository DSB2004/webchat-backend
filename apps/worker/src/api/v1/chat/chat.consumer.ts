import { Injectable, OnModuleInit } from '@nestjs/common';
import { KAFKA_EVENTS } from 'src/app.types';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { ChatService } from './chat.service';
import { Message } from '@webchat-backend/types';
import { ChatPublsiher } from './chat.publisher';
interface ConsumerMessage {
  event: KAFKA_EVENTS;
  data: Message;
  userId: string;
}
@Injectable()
export class ChatConsumer implements OnModuleInit {
  constructor(
    private readonly consumer: ConsumerService,
    private readonly chat: ChatService,
    
  ) {}

  async onModuleInit() {
    await this.consumer.consume(
      { topics: ['chat-message'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const messageJSON =
            (JSON.parse(
              message.value?.toString() || '{}',
            ) as ConsumerMessage) || null;
          null;
          if (!messageJSON || messageJSON === null) {
            console.warn('Message Body Required');
            return;
          }
          const { event } = messageJSON;
          console.log(message.value?.toString(), topic, partition);
          if (event === KAFKA_EVENTS.MESSAGE_CREATE) {
            this.chat.addMessage({
              message: messageJSON.data,
            });
          } else if (event === KAFKA_EVENTS.MESSAGE_DELETE) {
            this.chat.deleteMessage({
              messageId: messageJSON.data.id,
              userId: messageJSON.userId,
            });
          } else if (event === KAFKA_EVENTS.MESSAGE_UPDATE) {
            this.chat.updateMessage({
              messageId: messageJSON.data.id,
              userId: messageJSON.userId,
              content: messageJSON.data.content,
            });
          }
        },
      },
    );
  }
}
