import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { SocketsModule } from './sockets/sockets.module';
import { UtilsModule } from './utils/utils.module';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApiModule,
    SocketsModule,
    UtilsModule,
  ],
  controllers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
