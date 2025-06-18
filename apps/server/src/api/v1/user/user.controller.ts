import {
  Controller,
  Post,
  Body,
  HttpException,
  Patch,
  Headers,
  Get,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UtilService } from 'src/util/util.service';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly util: UtilService,
  ) {}
  @Post()
  async createUser(
    @Body()
    body: {
      status?: string;
      description?: string;
      profilePic?: string;
      publicKey: string;
    },
    @Headers('authorization') accessToken: string,
  ) {
    if (!body) throw new HttpException('Body is required', 400);
    const user = await this.util.getUser({ accessToken });
    if (user == null) throw new HttpException('Token expired', 401);
    const { email } = user;
    const { profilePic, description, status: userStatus, publicKey } = body;
    const { status, message, ...rest } = await this.userService.create({
      email,
      description,
      status: userStatus,
      profilePic,
      publicKey,
    });

    if (status !== 200) {
      throw new HttpException(message, status);
    }
    return { status, message, ...rest };
  }
  @Patch()
  async updateUser(
    @Body()
    body: {
      status?: string;
      description?: string;
      profilePic?: string;
    },
    @Headers('authorization') accessToken: string,
  ) {
    if (!body) throw new HttpException('Body is required', 400);
    const user = await this.util.getUser({ accessToken });
    if (user == null) throw new HttpException('Token expired', 401);
    const { email } = user;
    const { profilePic, description, status: userStatus } = body;
    const { status, message, ...rest } = await this.userService.update({
      email,
      description,
      status: userStatus,
      profilePic,
    });

    if (status !== 200) {
      throw new HttpException(message, status);
    }
    return { status, message, ...rest };
  }

  @Get()
  async getUser(@Headers('authorization') accessToken: string) {
    const user = await this.util.getUser({ accessToken });
    if (user == null) throw new HttpException('Token expired', 401);
    const { email } = user;
    const { status, message, ...rest } = await this.userService.list({
      email,
    });

    if (status !== 200) {
      throw new HttpException(message, status);
    }
    return { status, message, ...rest };
  }
}
