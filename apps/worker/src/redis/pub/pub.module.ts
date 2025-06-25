import { Module } from '@nestjs/common';
import { PubService } from './pub.service';

@Module({
  providers: [PubService],
  exports: [PubService],
})
export class PubModule {}
