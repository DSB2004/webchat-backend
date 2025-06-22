import { Module } from '@nestjs/common';
import { ChatProducer } from './chat.producer';
import { ChatController } from './chat.controller';
import { ChatConsumer } from './chat.consumer';
import { KafkaModule } from 'src/kafka/kafka.module';
import { ProducerModule } from 'src/kafka/producer/producer.module';
import { ConsumerModule } from 'src/kafka/consumer/consumer.module';
import { ChatService } from './chat.service';
import { UtilModule } from 'src/util/util.module';
@Module({
  imports: [ProducerModule, ConsumerModule, UtilModule],
  providers: [ChatProducer, ChatConsumer, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
