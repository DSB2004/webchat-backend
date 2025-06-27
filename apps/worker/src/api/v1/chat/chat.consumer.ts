import { Injectable, OnModuleInit } from '@nestjs/common';
import { KAFKA_EVENTS } from 'src/app.types';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { ChatService } from './chat.service';
import { Message } from '@webchat-backend/types';

interface ConsumerMessage extends Message {
  event: KAFKA_EVENTS;
  userId: string;
  messageId?: string;
}

@Injectable()
export class ChatConsumer implements OnModuleInit {
  constructor(
    private readonly consumer: ConsumerService,
    private readonly chat: ChatService,
  ) {}

  async onModuleInit() {
    await this.consumer.consume(
      'webchat-chat-messages',
      { topics: ['chat-message'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const rawValue = message.value?.toString();
            if (!rawValue) {
              console.warn('⚠️ Empty message payload received');
              return;
            }
            const parsed: ConsumerMessage = JSON.parse(rawValue);
            console.log(parsed);

            if (
              !parsed.event ||
              (parsed.event === KAFKA_EVENTS.MESSAGE_CREATE && !parsed.id) ||
              !parsed.messageId
            ) {
              console.warn('⚠️ Invalid message structure', parsed);
              return;
            }

            console.log(
              `📨 Received event ${parsed.event} on topic '${topic}', partition ${partition}`,
            );

            const { event, userId, id, messageId } = parsed;

            switch (event) {
              case KAFKA_EVENTS.MESSAGE_CREATE:
                await this.chat.addMessage({ message: parsed });
                break;

              case KAFKA_EVENTS.MESSAGE_DELETE:
                await this.chat.deleteMessage({
                  messageId,
                  userId,
                });
                break;

              case KAFKA_EVENTS.MESSAGE_UPDATE:
                await this.chat.updateMessage({
                  messageId,
                  userId,
                  content: parsed.content,
                });
                break;

              default:
                console.warn(`⚠️ Unhandled event type: ${event}`);
                break;
            }
          } catch (err) {
            console.error('❌ Error processing message:', err);
          }
        },
      },
    );
  }
}
