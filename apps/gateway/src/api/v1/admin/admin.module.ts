import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminModule as AdminGatewayModule } from 'src/sockets/chatroom/admin/admin.module';
@Module({
  imports: [AdminGatewayModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
