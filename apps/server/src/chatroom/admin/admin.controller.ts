import {
  Controller,
  Patch,
  Headers,
  Param,
  Body,
  HttpException,
} from '@nestjs/common';
import { SharedService } from 'src/shared/shared.service';
import { AdminService } from './admin.service';
@Controller('admin')
export class AdminController {
  constructor(
    private readonly sharedService: SharedService,
    private readonly adminService: AdminService,
  ) {}

  @Patch('/add/:chatroomId')
  async addAdmins(
    @Param('chatroomId') chatroomId: string,
    @Headers('authorization') accessToken: string,
    @Body() body: { admins: string[]; admin: string },
  ) {
    try {
      const user = await this.sharedService.getUser({ accessToken });
      if (!user) throw new HttpException('Unauthorized', 401);

      const { admins, admin } = body;

      const { status, message } = await this.adminService.addAdmin({
        chatroomId,
        adminIds: admins,
        adminId: admin,
      });

      if (status !== 200) {
        throw new HttpException(message, status);
      }

      return { status, message };
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  @Patch('/remove/:chatroomId')
  async removeAdmins(
    @Param('chatroomId') chatroomId: string,
    @Headers('authorization') accessToken: string,
    @Body() body: { admins: string[]; admin: string },
  ) {
    try {
      const user = await this.sharedService.getUser({ accessToken });
      if (!user) throw new HttpException('Unauthorized', 401);

      const { admins, admin } = body;

      const { status, message } = await this.adminService.removeAdmin({
        chatroomId,
        adminIds: admins,
        adminId: admin,
      });

      if (status !== 200) {
        throw new HttpException(message, status);
      }
      return { status, message };
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
