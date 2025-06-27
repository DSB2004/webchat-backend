import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { UtilsModule } from 'src/utils/utils.module';
@Module({
  imports: [UtilsModule],
  providers: [EventsGateway],
})
export class EventsModule {}
