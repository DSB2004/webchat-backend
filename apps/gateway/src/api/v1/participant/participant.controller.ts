import { Controller, HttpException, Post, Body } from '@nestjs/common';
import { ParticipantService } from './participant.service';

@Controller('participant')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}
  @Post('join')
  async handleJoinParticipantNotify(
    @Body() body: { message: string; chatroomId: string },
  ) {
    
      const { message, status } =
        await this.participantService.notifyJoinParticipant(body);

      if (status != 200) {
        throw new HttpException(message, status);
      }
      return { status, message };
   
  }
  @Post('leave')
  async handleLeftParticipantNotify(
    @Body() body: { message: string; chatroomId: string },
  ) {

      const { message, status } =
        await this.participantService.notifyLeftParticipant(body);

      if (status != 200) {
        throw new HttpException(message, status);
      }
      return { status, message };

  }
  @Post('add')
  async handleAddParticipantNotify(
    @Body() body: { message: string; chatroomId: string },
  ) {

      const { message, status } =
        await this.participantService.notifyAddParticipant(body);

      if (status != 200) {
        throw new HttpException(message, status);
      }
      return { status, message };
   
  }
  @Post('remove')
  async handleRemoveParticipantNotify(
    @Body() body: { message: string; chatroomId: string },
  ) {

    const { message, status } =
      await this.participantService.notifyRemoveParticipant(body);

    if (status != 200) {
      throw new HttpException(message, status);
    }
    return { status, message };
  }
  @Post('chatroom')
  async handleChatroomCreatedNotify(
    @Body() body: { message: string; chatroomId: string },
  ) {

      const { message, status } =
        await this.participantService.notifyChatroomCreated(body);

      if (status != 200) {
        throw new HttpException(message, status);
      }
      return { status, message };
   
  }
}
