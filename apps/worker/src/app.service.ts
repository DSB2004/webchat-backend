import { Injectable } from '@nestjs/common';
import { redis } from '@webchat-backend/redis';
@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    const ping = await redis.ping();
    console.log(ping);
    const key = 'test';
    const value = await redis.get(key);
    return 'Hello World Worker! ' + value?.toString();
  }
}
