import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UtilModule } from 'src/util/util.module';
@Module({
  imports: [UtilModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
