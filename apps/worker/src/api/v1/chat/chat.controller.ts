import { Controller, Post, Patch, Body, HttpException } from '@nestjs/common';
import { Message } from '@webchat-backend/types';
import { ChatProducer } from './chat.producer';
@Controller('chat')
export class ChatController {
  constructor(private readonly chat: ChatProducer) {}

  @Post('add')
  async addMessage(@Body() body: Message) {
    try {
      
      const { id, content, authorId, chatroomId, type } = body;
      if (!id || !content || !authorId || !chatroomId || !type)
        throw new HttpException('Parameter missing', 400);
      const { status, message } = await this.chat.addMessage({ message: body });
      if (status !== 202) {
        throw new HttpException(message, status);
      }
      return { status, message };
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
  @Post('update')
  async updateMessage(
    @Body() body: { userId: string; messageId: string; content: string },
  ) {
    try {
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
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  @Post('delete')
  async deleteMessage(@Body() body: { userId: string; messageId: string }) {
    try {
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
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
