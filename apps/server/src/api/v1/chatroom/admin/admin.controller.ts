import {
  Controller,
  Patch,
  Headers,
  Param,
  Body,
  HttpException,
} from '@nestjs/common';
import { UtilService } from 'src/util/util.service';
import { AdminService } from './admin.service';
@Controller('admin')
export class AdminController {
  constructor(
    private readonly util: UtilService,
    private readonly adminService: AdminService,
  ) {}

  @Patch('/add/:chatroomId')
  async addAdmins(
    @Param('chatroomId') chatroomId: string,
    @Headers('authorization') accessToken: string,
    @Body() body: { admins: string[] },
  ) {
    const user = await this.util.getUserInfo({ accessToken });
    if (!user) throw new HttpException('Unauthorized', 401);

    const { admins } = body;
    if (!admins) throw new HttpException('admins list is required', 400);
    const { status, message } = await this.adminService.addAdmin({
      chatroomId,
      adminIds: admins,
      adminId: user.id,
    });

    if (status !== 200) {
      throw new HttpException(message, status);
    }

    return { status, message };
  }

  @Patch('/remove/:chatroomId')
  async removeAdmins(
    @Param('chatroomId') chatroomId: string,
    @Headers('authorization') accessToken: string,
    @Body() body: { admins: string[] },
  ) {
    const user = await this.util.getUserInfo({ accessToken });
    if (!user) throw new HttpException('Unauthorized', 401);

    const { admins } = body;
    if (!admins) throw new HttpException('admins list is required', 400);
    const { status, message } = await this.adminService.removeAdmin({
      chatroomId,
      adminIds: admins,
      adminId: user.id,
    });

    if (status !== 200) {
      throw new HttpException(message, status);
    }
    return { status, message };
  }

  @Patch('/leave/:chatroomId')
  async leaveAdmins(
    @Param('chatroomId') chatroomId: string,
    @Headers('authorization') accessToken: string,
  ) {
    const user = await this.util.getUserInfo({ accessToken });
    if (!user) throw new HttpException('Unauthorized', 401);

    const { status, message } = await this.adminService.leaveAdmin({
      chatroomId,
      adminId: user.id,
    });

    if (status !== 200) {
      throw new HttpException(message, status);
    }
    return { status, message };
  }
}
