import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class AdminService implements OnModuleInit {
  private readonly kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKER_URL || 'localhost:9092'],
  });

  private readonly topics: any[] = [
    {
      topic: 'chat-message',
      numPartitions: 3,
      replicationFactor: 1,
    },
  ];

  async onModuleInit() {
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV !== 'development') return;
    const admin = this.kafka.admin();
    await admin.connect();

    const existingTopics = await admin.listTopics();

    const topicsToCreate = this.topics
      .filter((topic) => !existingTopics.includes(topic.topic))
      .map((topic) => ({
        ...topic,
      }));

    if (topicsToCreate.length > 0) {
      await admin.createTopics({
        topics: topicsToCreate,
        waitForLeaders: true,
      });
      const metadata = await admin.fetchTopicMetadata({
        topics: ['chat-message'],
      });
      console.log(JSON.stringify(metadata, null, 2));
    } else {
      console.log(`⚠️ Kafka topics already exist:`, existingTopics);
    }

    await admin.disconnect();
  }
}
