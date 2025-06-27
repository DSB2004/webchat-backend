import { Controller, Post, Patch, Body, HttpException } from '@nestjs/common';
import { Message } from '@webchat-backend/types';
import { ChatProducer } from './chat.producer';
@Controller('chat')
export class ChatController {
  constructor(private readonly chat: ChatProducer) {}

  @Post('add')
  async addMessage(@Body() body: { userId: string } & Message) {
    const { id, content, userId, chatroomId, type } = body;
    if (!id || !content || !userId || !chatroomId || !type)
      throw new HttpException('Parameter missing', 400);
    const { status, message } = await this.chat.addMessage({ message: body });
    if (status !== 202) {
      throw new HttpException(message, status);
    }
    return { status, message };
  }
  @Post('update')
  async updateMessage(
    @Body() body: { userId: string; messageId: string; content: string },
  ) {
    const { content, userId, messageId } = body;
    if (!userId || !content || !messageId)
      throw new HttpException('Parameter missing', 400);
    const { status, message } = await this.chat.updateMessage({
      message: body,
    });
    if (status !== 202) {
      throw new HttpException(message, status);
    }
    return { status, message };
  }

  @Post('delete')
  async deleteMessage(@Body() body: { userId: string; messageId: string }) {
    const { userId, messageId } = body;
    if (!userId || !messageId)
      throw new HttpException('Parameter missing', 400);
    const { status, message } = await this.chat.deleteMessage({
      message: body,
    });
    if (status !== 202) {
      throw new HttpException(message, status);
    }
    return { status, message };
  }
}
