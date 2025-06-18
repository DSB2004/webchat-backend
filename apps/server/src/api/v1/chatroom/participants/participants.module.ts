import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { UtilModule } from 'src/util/util.module';
@Module({
  imports: [UtilModule],
  providers: [ParticipantsService],
  controllers: [ParticipantsController],
})
export class ParticipantsModule {}
