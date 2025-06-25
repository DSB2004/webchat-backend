import { Module } from '@nestjs/common';
import { ChatProducer } from './chat.producer';
import { ChatController } from './chat.controller';
import { ChatConsumer } from './chat.consumer';
import { ProducerModule } from 'src/kafka/producer/producer.module';
import { ConsumerModule } from 'src/kafka/consumer/consumer.module';
import { ChatService } from './chat.service';
import { UtilModule } from 'src/util/util.module';
import { ChatPublisher } from './chat.publisher';
import { PubModule } from 'src/redis/pub/pub.module';
@Module({
  imports: [ProducerModule, ConsumerModule, PubModule, UtilModule],
  providers: [ChatProducer, ChatConsumer, ChatService, ChatPublisher],
  controllers: [ChatController],
})
export class ChatModule {}
