import { Controller, Param, HttpException, Get, Query } from '@nestjs/common';
import { MessageService } from './message.service';
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/:chatroomId')
  async getMessages(
    @Param('chatroomId') chatroomId: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
  ) {
    try {
      const { message, status, ...rest } =
        await this.messageService.getMessages({ chatroomId, limit, page });
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
