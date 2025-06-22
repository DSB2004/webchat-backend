import { Module } from '@nestjs/common';
import { PubModule } from './pub/pub.module';
import { SubModule } from './sub/sub.module';
import { RedisService } from './redis.service';

@Module({
  imports: [PubModule, SubModule],
  providers: [RedisService]
})
export class RedisModule {}
