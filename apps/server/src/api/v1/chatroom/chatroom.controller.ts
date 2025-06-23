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
import { UtilService } from 'src/util/util.service';
import { VerifyJWT } from '@webchat-backend/jwt';
import { db } from '@webchat-backend/db';
@Controller('chatroom')
export class ChatroomController {
  constructor(
    private readonly chatroomService: ChatroomService,
    private readonly util: UtilService,
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

    if (!id || id === null) {
      throw new HttpException('id is required', 400);
    }
    const { message, status, ...rest } =
      await this.chatroomService.getChatroom(id);

    if (status !== 200) {
      throw new HttpException(message, status);
    }
    return { message, status, ...rest };
  }

  @Get('/invitecode/:code')
  async getChatroomByInviteCode(
    @Param()
    param: {
      code: string;
    },
  ) {
    const { code } = param;
      if (!code || code === null) {
        throw new HttpException('code is required', 400);
      }
      const { message, status, ...rest } =
        await this.chatroomService.getChatroomByInviteCode(code);

      if (status !== 200) {
        throw new HttpException(message, status);
      }
      return { message, status, ...rest };
   

  }

  @Post()
  async createChatroom(
    @Body()
    body: {
      participants: string[];
      type: 'GROUP' | 'PERSONAL';
    },
    @Headers('request_email') email: string,
  ) {

      if (!body) throw new HttpException('Body is required', 400);

      const user = await db.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) throw new HttpException('User not found', 400);
      const { participants, type } = body;
      const owner = user.id;
      if (!participants  || !owner || !type) {
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

  }

  @Get('/search')
  async searchChatroom(
    @Query() query: { search: string },
    @Headers('authorization') accessToken: string,
  ) {
      const user = await this.util.getUser({ accessToken });
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
  }

  @Get('/:id/invitecode')
  async getChatroomInviteCode(
    @Param() param: { id: string },
    @Headers('authorization') accessToken: string,
  ) {

      const user = await this.util.getUser({ accessToken });
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

  }
}
