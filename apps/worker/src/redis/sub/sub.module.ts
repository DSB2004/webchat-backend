import { Module } from '@nestjs/common';
import { SubService } from './sub.service';
import { PubService } from '../pub/pub.service';

@Module({
  providers: [SubService],
  exports: [SubService],
})
export class SubModule {}
