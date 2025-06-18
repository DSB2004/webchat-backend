import { Module } from '@nestjs/common';
import { V1Module } from './v1/v1.module';
import { RouterModule } from '@nestjs/core';

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
export class ApiModule {}
