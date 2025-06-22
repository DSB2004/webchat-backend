import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { ApiModule } from './api/api.module';
import { UtilModule } from './util/util.module';
import { RedisPubSubModule } from './redis-pub-sub/redis-pub-sub.module';
import { RedisModule } from './redis/redis.module';


@Module({
  imports: [KafkaModule, ApiModule, UtilModule, RedisPubSubModule, RedisModule],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {}
