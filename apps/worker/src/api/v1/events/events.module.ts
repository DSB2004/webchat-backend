import { Module } from '@nestjs/common';
import { EventsConsumer } from './events.consumer';
import { EventsService } from './events.service';
import { EventsProducer } from './events.producer';
import { UtilModule } from 'src/util/util.module';
import { EventsController } from './events.controller';
import { RedisPubSubModule } from 'src/redis-pub-sub/redis-pub-sub.module';

@Module({
  imports: [UtilModule, RedisPubSubModule],
  providers: [EventsService, EventsConsumer, EventsProducer],
  controllers: [EventsController],
})
export class EventsModule {}
