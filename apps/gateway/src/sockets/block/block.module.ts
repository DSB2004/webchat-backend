import { Module } from '@nestjs/common';
import { BlockGateway } from './block.gateway';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [UtilsModule],
  providers: [BlockGateway],
  exports: [BlockGateway],
})
export class BlockModule {}
