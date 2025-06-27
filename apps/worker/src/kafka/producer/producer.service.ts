import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Producer, ProducerRecord } from 'kafkajs';
import { kafka } from '../kafka';
@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly producer: Producer = kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
  }
  async onApplicationShutdown(signal?: string) {
    await this.producer.disconnect();
  }
  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }
}
