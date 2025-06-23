import { Controller, HttpException, Post, Body } from '@nestjs/common';
import { ParticipantService } from './participant.service';

@Controller('participant')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}
  @Post('join')
  async handleJoinParticipantNotify(
    @Body() body: { message: string; chatroomId: string },
  ) {
    try {
      const { message, status } =
        await this.participantService.notifyJoinParticipant(body);

      if (status != 200) {
        throw new HttpException(message, status);
      }
      return { status, message };
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
  @Post('left')
  async handleLeftParticipantNotify(
    @Body() body: { message: string; chatroomId: string },
  ) {
    try {
      const { message, status } =
        await this.participantService.notifyJoinParticipant(body);

      if (status != 200) {
        throw new HttpException(message, status);
      }
      return { status, message };
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
  @Post('add')
  async handleAddParticipantNotify(
    @Body() body: { message: string; chatroomId: string },
  ) {
    try {
      const { message, status } =
        await this.participantService.notifyJoinParticipant(body);

      if (status != 200) {
        throw new HttpException(message, status);
      }
      return { status, message };
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
  @Post('remove')
  async handleRemoveParticipantNotify(
    @Body() body: { message: string; chatroomId: string },
  ) {
    try {
      const { message, status } =
        await this.participantService.notifyJoinParticipant(body);

      if (status != 200) {
        throw new HttpException(message, status);
      }
      return { status, message };
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
  @Post('chatroom')
  async handleChatroomCreatedNotify(
    @Body() body: { message: string; chatroomId: string },
  ) {
    try {
      const { message, status } =
        await this.participantService.notifyChatroomCreated(body);

      if (status != 200) {
        throw new HttpException(message, status);
      }
      return { status, message };
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
