import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { ApiModule } from './api/api.module';
import { UtilModule } from './util/util.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [KafkaModule, ApiModule, UtilModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
