import { Module } from '@nestjs/common';
import { EventsConsumer } from './events.consumer';
import { EventsService } from './events.service';
import { EventsProducer } from './events.producer';
import { UtilModule } from 'src/util/util.module';
import { EventsController } from './events.controller';
import { ConsumerModule } from 'src/kafka/consumer/consumer.module';
import { PubModule } from 'src/redis/pub/pub.module';
import { SubModule } from 'src/redis/sub/sub.module';
import { ProducerModule } from 'src/kafka/producer/producer.module';
import { EventPublisher } from './event.publisher';

@Module({
  imports: [UtilModule, ConsumerModule, PubModule, SubModule, ProducerModule],
  providers: [EventsService, EventsConsumer, EventsProducer, EventPublisher],
  controllers: [EventsController],
})
export class EventsModule {}
