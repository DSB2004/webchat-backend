import { Injectable } from '@nestjs/common';
import { redis } from '@webchat-backend/redis';
@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    const key = 'test';
    const value = await redis.get(key);
    return 'Hello World Worker! ' + value?.toString();
  }
}
