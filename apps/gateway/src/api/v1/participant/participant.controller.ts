import { Controller, HttpException, Patch, Body } from '@nestjs/common';
import { ParticipantService } from './participant.service';

@Controller('participant')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}
  @Patch('join')
  async handleJoinParticipantNotify(
    @Body() body: { message: string; chatroomId },
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
  @Patch('left')
  async handleLeftParticipantNotify(
    @Body() body: { message: string; chatroomId },
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
  @Patch('add')
  async handleAddParticipantNotify(
    @Body() body: { message: string; chatroomId },
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
  @Patch('remove')
  async handleRemoveParticipantNotify(
    @Body() body: { message: string; chatroomId },
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
}
