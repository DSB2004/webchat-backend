import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { V1Module } from './v1/v1.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { ApiKeyCheckMiddleware } from '../middleware/api-key-check/api-key-check.middleware';
@Module({
  imports: [V1Module],
  controllers: [],
  providers: [],
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyCheckMiddleware).forRoutes('*');
  }
}
