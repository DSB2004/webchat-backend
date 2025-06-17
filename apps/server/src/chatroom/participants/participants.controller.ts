import {
  Controller,
  Patch,
  Headers,
  Param,
  Body,
  HttpException,
} from '@nestjs/common';
import { SharedService } from 'src/shared/shared.service';
import { ParticipantsService } from './participants.service';

@Controller('participants')
export class ParticipantsController {
  constructor(
    private readonly sharedService: SharedService,
    private readonly participant: ParticipantsService,
  ) {}

  @Patch('/add/:chatroomId')
  async addParticipants(
    @Param('chatroomId') chatroomId: string,
    @Headers('authorization') accessToken: string,
    @Body() body: { participants: string[]; admin: string },
  ) {
    const user = await this.sharedService.getUser({ accessToken });
    if (!user) throw new HttpException('Unauthorized', 401);

    const { participants, admin } = body;

    const { status, message } = await this.participant.addParticipant({
      chatroomId,
      participantIds: participants,
      adminId: admin,
    });

    if (status !== 200) {
      throw new HttpException(message, status);
    }

    return { status, message };
  }

  @Patch('/remove/:chatroomId')
  async removeParticipants(
    @Param('chatroomId') chatroomId: string,
    @Headers('authorization') accessToken: string,
    @Body() body: { participants: string[]; admin: string },
  ) {
    const user = await this.sharedService.getUser({ accessToken });
    if (!user) throw new HttpException('Unauthorized', 401);

    const { participants, admin } = body;

    const { status, message } = await this.participant.removeParticipant({
      chatroomId,
      participantIds: participants,
      adminId: admin,
    });

    if (status !== 200) {
      throw new HttpException(message, status);
    }

    return { status, message };
  }

  @Patch('/join/:code')
  async joinChatroom(
    @Param('code') code: string,
    @Headers('authorization') accessToken: string,
  ) {
    const user = await this.sharedService.getUser({ accessToken });
    if (!user) throw new HttpException('Unauthorized', 401);

    const { id } = user;

    const { status, message } = await this.participant.joinChatroom({
      inviteCode: code,
      userId: id,
    });

    if (status !== 200) {
      throw new HttpException(message, status);
    }

    return { status, message };
  }

  @Patch('/leave/:chatroomId')
  async removeChatroom(
    @Param('chatroomId') chatroomId: string,
    @Headers('authorization') accessToken: string,
  ) {
    const user = await this.sharedService.getUser({ accessToken });
    if (!user) throw new HttpException('Unauthorized', 401);

    const { id } = user;

    const { status, message } = await this.participant.leaveChatroom({
      chatroomId,
      userId: id,
    });

    if (status !== 200) {
      throw new HttpException(message, status);
    }

    return { status, message };
  }
}
