import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { db } from '@webchat-backend/db';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    const user_count = await db.user.count();
    return this.appService.getHello(user_count);
  }
}
