import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ApiModule } from './api/api.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
@Module({
  imports: [
    RouterModule.register([
      {
        path: 'api',
        module: ApiModule,
      },
    ]),
    ApiModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // Apply to all routes
  }
}
