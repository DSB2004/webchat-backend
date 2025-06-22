import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Redis, redis } from '@webchat-backend/redis';

@Injectable()
export class SubService implements OnModuleInit, OnApplicationShutdown {
  private subscriber: Redis;

  async onModuleInit() {
    this.subscriber = redis;
    console.log('[REDIS] Subscriber initialized');
  }

  async onApplicationShutdown() {
    if (this.subscriber) {
      await this.subscriber.quit();
      console.log('[REDIS] Subscriber disconnected');
    }
  }

  async subscribe(channel: string, handler: (message: any) => Promise<void>) {
    await this.subscriber.subscribe(channel);

    this.subscriber.on('message', async (receivedChannel, rawMessage) => {
      if (receivedChannel === channel) {
        try {
          const parsed = JSON.parse(rawMessage);
          await handler(parsed);
        } catch (err) {
          console.error(`[Redis] Error handling message on ${channel}:`, err);
        }
      }
    });
    } 
}
