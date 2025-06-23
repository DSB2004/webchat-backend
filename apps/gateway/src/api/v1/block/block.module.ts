import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { BlockModule as BlockGatewayModule } from 'src/sockets/block/block.module';
@Module({
  imports: [BlockGatewayModule],
  providers: [BlockService],
  controllers: [BlockController],
})
export class BlockModule {}
