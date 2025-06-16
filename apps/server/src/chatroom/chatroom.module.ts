import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { AdminModule } from './admin/admin.module';
import { MessageModule } from './message/message.module';
import { ParticipantsModule } from './participants/participants.module';

@Module({
  providers: [ChatroomService],
  controllers: [ChatroomController],
  imports: [AdminModule, MessageModule, ParticipantsModule]
})
export class ChatroomModule {}
