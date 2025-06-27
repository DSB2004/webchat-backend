import { Module } from '@nestjs/common';

import { KafkaModule } from './kafka/kafka.module';
import { ApiModule } from './api/api.module';
import { UtilModule } from './util/util.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [KafkaModule, ApiModule, UtilModule, RedisModule],
})
export class AppModule {}
