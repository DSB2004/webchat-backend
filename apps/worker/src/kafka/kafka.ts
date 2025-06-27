import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER_URL || 'localhost:9092'],
});
