import { Module } from '@nestjs/common';
import { ProducerModule } from './producer/producer.module';
import { ConsumerModule } from './consumer/consumer.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ProducerModule, ConsumerModule, AdminModule]
})
export class KafkaModule {}
