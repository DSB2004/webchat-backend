import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [UtilsModule],
  providers: [ChatGateway],
})
export class ChatModule {}
