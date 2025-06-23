import { Module } from '@nestjs/common';
import { SocketsGateway } from './sockets.gateway';
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './chatroom/admin/admin.module';
import { ParticipantModule } from './chatroom/participant/participant.module';
import { UtilsModule } from 'src/utils/utils.module';
@Module({
  providers: [SocketsGateway],
  imports: [ChatModule, AdminModule, ParticipantModule, UtilsModule],
})
export class SocketsModule {}
