import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { ParticipantModule } from './participant/participant.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { ApiKeyCheckMiddleware } from 'src/middleware/api-key-check/api-key-check.middleware';
@Module({
  imports: [AdminModule, ParticipantModule],
})
export class V1Module {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyCheckMiddleware).forRoutes('*');
  }
}
