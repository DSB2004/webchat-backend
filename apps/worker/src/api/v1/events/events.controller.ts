import { Controller, HttpException, Body, Post } from '@nestjs/common';
import { EventsProducer } from './events.producer';
import { EventParams, StatusParams, ReactionParams } from 'src/app.types';
@Controller('events')
export class EventsController {
  constructor(private readonly producer: EventsProducer) {}

  @Post('status')
  async addUpdateStatus(@Body() body: StatusParams) {
    const { messageId, userId, status: userStatus, chatroomId } = body;
    if (!messageId || !userId || !userStatus || !chatroomId) {
      throw new HttpException('Paramter missing', 400);
    }
    const { message, status } = await this.producer.addOrUpdateStatus({
      message: body,
    });
    if (status !== 202) {
      throw new HttpException(message, status);
    }
  }

  @Post('reaction')
  async addUpdateReaction(@Body() body: ReactionParams) {
    const { messageId, userId, label, reaction, chatroomId } = body;
    if (!messageId || !userId || !label || !reaction || !chatroomId) {
      throw new HttpException('Paramter missing', 400);
    }
    const { message, status } = await this.producer.addOrUpdateReaction({
      message: body,
    });
    if (status !== 202) {
      throw new HttpException(message, status);
    }
  }

  @Post('pin')
  async togglePin(@Body() body: EventParams) {
    const { messageId, userId, chatroomId } = body;
    if (!messageId || !userId || !chatroomId) {
      throw new HttpException('Paramter missing', 400);
    }
    const { message, status } = await this.producer.tooglePinned({
      message: body,
    });
    if (status !== 202) {
      throw new HttpException(message, status);
    }
  }

  @Post('star')
  async toggleStar(@Body() body: EventParams) {
    const { messageId, userId, chatroomId } = body;
    if (!messageId || !userId || !chatroomId) {
      throw new HttpException('Paramter missing', 400);
    }
    const { message, status } = await this.producer.toggleStarred({
      message: body,
    });
    if (status !== 202) {
      throw new HttpException(message, status);
    }
  }
}
