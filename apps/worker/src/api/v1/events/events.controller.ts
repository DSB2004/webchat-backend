import { Controller, HttpException, Patch, Body } from '@nestjs/common';
import { EventsProducer } from './events.producer';
import { EventParams, StatusParams, ReactionParams } from 'src/app.types';
@Controller('events')
export class EventsController {
  constructor(private readonly producer: EventsProducer) {}

  @Patch('status')
  async addUpdateStatus(@Body() body: StatusParams) {
    try {
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
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  @Patch('reaction')
  async addUpdateReaction(@Body() body: ReactionParams) {
    try {
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
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  @Patch('pin')
  async togglePin(@Body() body: EventParams) {
    try {
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
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  @Patch('star')
  async toggleStar(@Body() body: EventParams) {
    try {
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
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
