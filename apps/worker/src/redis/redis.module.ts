import { Module } from '@nestjs/common';
import { PubModule } from './pub/pub.module';
import { SubModule } from './sub/sub.module';

@Module({
  imports: [PubModule, SubModule],
  
})
export class RedisModule {}
