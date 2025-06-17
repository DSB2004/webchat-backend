import {
  Controller,
  Post,
  Get,
  Param,
  HttpException,
  Body,
  Headers,
  Query,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { SharedService } from 'src/shared/shared.service';
@Controller('chatroom')
export class ChatroomController {
  constructor(
    private readonly chatroomService: ChatroomService,
    private readonly sharedService: SharedService,
  ) {}
  @Get('/:id')
  async getChatroom(
    @Param()
    param: {
      id: string;
    },
    @Headers('authorization') accessToken: string,
  ) {
    const { id } = param;
    try {
      if (!id || id === null) {
        throw new HttpException('id is required', 400);
      }
      const { message, status, ...rest } =
        await this.chatroomService.getChatroom(id);

      if (status !== 200) {
        throw new HttpException(message, status);
      }
      return { message, status, ...rest };
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  @Get('/invitecode/:code')
  async getChatroomByInviteCode(
    @Param()
    param: {
      code: string;
    },
  ) {
    const { code } = param;
    try {
      if (!code || code === null) {
        throw new HttpException('code is required', 400);
      }
      const { message, status, ...rest } =
        await this.chatroomService.getChatroomByInviteCode(code);

      if (status !== 200) {
        throw new HttpException(message, status);
      }
      return { message, status, ...rest };
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  @Post()
  async createChatroom(
    @Body()
    body: {
      participants: string[];
      owner: string;
      type: 'GROUP' | 'PERSONAL';
    },
    @Headers('authorization') accessToken: string,
  ) {
    try {
      if (!body) throw new HttpException('Body is required', 400);
      const { participants, owner, type } = body;
      if (!participants || participants.length === 0 || !owner || !type) {
        throw new HttpException(
          'participant, owner and type all are required',
          400,
        );
      }
      if (type !== 'GROUP' && type !== 'PERSONAL') {
        throw new HttpException('type can be only PERSONAL or GROUP', 400);
      }
      const { message, status, ...rest } =
        await this.chatroomService.createChatroom({
          participants,
          owner,
          type,
        });

      if (status !== 200) {
        throw new HttpException(message, status);
      }
      return { message, status, ...rest };
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  @Get('/search')
  async searchChatroom(
    @Query() query: { search: string },
    @Headers('authorization') accessToken: string,
  ) {
    try {
      const user = await this.sharedService.getUser({ accessToken });
      if (user == null) throw new HttpException('Token expired', 401);
      const { email } = user;
      const { search } = query;
      const { message, status, ...rest } =
        await this.chatroomService.searchChatroom({
          email,
          searchUsername: search,
        });

      if (status !== 200) {
        throw new HttpException(message, status);
      }
      return { message, status, ...rest };
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  @Get('/:id/invitecode')
  async getChatroomInviteCode(
    @Param() param: { id: string },
    @Headers('authorization') accessToken: string,
  ) {
    try {
      const user = await this.sharedService.getUser({ accessToken });
      if (user == null) throw new HttpException('Token expired', 401);
      const { email } = user;
      const { id } = param;
      const { message, status, ...rest } =
        await this.chatroomService.getChatroomInviteCode({
          email,
          id,
        });

      if (status !== 200) {
        throw new HttpException(message, status);
      }
      return { message, status, ...rest };
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
