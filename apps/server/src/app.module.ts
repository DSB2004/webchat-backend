import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { ChatroomModule } from './chatroom/chatroom.module';

@Module({
  imports: [UserModule, AuthModule, SharedModule, ChatroomModule],
})
export class AppModule {}
