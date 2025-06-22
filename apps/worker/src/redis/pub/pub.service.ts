import { Injectable } from '@nestjs/common';
import { Redis, redis } from '@webchat-backend/redis';
@Injectable()
export class PubService {
  private publisher: Redis | null = null;

  async onModuleInit() {
    this.publisher = redis;
    console.log('[REDIS] Publisher initialized');
  }

  async onApplicationShutdown() {
    if (this.publisher) {
      await this.publisher.quit();
      console.log('[REDIS] Publisher disconnected');
    }
  }

  async publish(channel: string, message: string) {
    try {
      await this.publisher?.publish(channel, message);
      return true;
    } catch (err) {
      return false;
    }
  }
}
