import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
@Module({
  imports: [UserModule, ChatroomModule, AuthModule, UploadModule],
})
export class V1Module {}
