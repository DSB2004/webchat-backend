import { Module } from '@nestjs/common';
import { ParticipantGateway } from './participant.gateway';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [UtilsModule],
  providers: [ParticipantGateway],
  exports: [ParticipantGateway],
})
export class ParticipantModule {}
