import { Module } from '@nestjs/common';
import { AdminGateway } from './admin.gateway';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [UtilsModule],
  providers: [AdminGateway],
  exports: [AdminGateway],
})
export class AdminModule {}
