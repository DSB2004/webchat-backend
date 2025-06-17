import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { AdminModule } from './admin/admin.module';
import { MessageModule } from './message/message.module';
import { ParticipantsModule } from './participants/participants.module';
import { SharedModule } from 'src/shared/shared.module';
@Module({
  providers: [ChatroomService],
  controllers: [ChatroomController],
  imports: [SharedModule, AdminModule, MessageModule, ParticipantsModule],
})
export class ChatroomModule {}
