import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { UtilModule } from 'src/util/util.module';

@Module({
  imports: [UtilModule],
  providers: [BlockService],
  controllers: [BlockController],
})
export class BlockModule {}
