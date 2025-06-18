import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { V1Module } from './v1/v1.module';

@Module({
  imports: [V1Module],
  controllers: [], // V1Module itself might not have controllers, but it imports UserModule which does.
  providers: [],
})
export class ApiModule {}
