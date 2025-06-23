import { Module } from '@nestjs/common';
import { V1Module } from './v1/v1.module';
import { RouterModule } from '@nestjs/core';
import { MiddlewareConsumer } from '@nestjs/common';
import { JwtMiddleware } from 'src/middleware/jwt/jwt.middleware';
import { IsVerifedMiddleware } from 'src/middleware/is-verifed/is-verifed.middleware';
@Module({
  imports: [
    V1Module,
    RouterModule.register([
      {
        path: 'v1',
        module: V1Module,
      },
    ]),
  ],
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware, IsVerifedMiddleware)
      .forRoutes('/user/*', '/chatroom/*');
  }
}
