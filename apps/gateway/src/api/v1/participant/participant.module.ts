import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { ParticipantModule as ParticipantGatewayModule } from 'src/sockets/chatroom/participant/participant.module';
@Module({
  imports: [ParticipantGatewayModule],
  controllers: [ParticipantController],
  providers: [ParticipantService],
})
export class ParticipantModule {}
