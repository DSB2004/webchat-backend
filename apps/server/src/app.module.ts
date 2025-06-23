import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { RateLimitMiddleware } from './middleware/rate-limit/rate-limit.middleware';
@Module({
  imports: [ApiModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(RateLimitMiddleware).forRoutes('*');
  }
}
