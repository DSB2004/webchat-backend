import { Module } from '@nestjs/common';
import { EventsConsumer } from './events.consumer';
import { EventsService } from './events.service';
import { EventsProducer } from './events.producer';
import { UtilModule } from 'src/util/util.module';
import { EventsController } from './events.controller';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [UtilModule, RedisModule],
  providers: [EventsService, EventsConsumer, EventsProducer],
  controllers: [EventsController],
})
export class EventsModule {}
