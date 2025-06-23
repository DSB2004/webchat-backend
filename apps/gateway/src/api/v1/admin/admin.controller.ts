import { Controller, Post, HttpException, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post('add')
  async handleAddParticipantNotify(
    @Body() body: { message: string; chatroomId: string },
  ) {
    const { message, status } = await this.adminService.notifyAddAdmin(body);

    if (status != 200) {
      throw new HttpException(message, status);
    }
    return { status, message };
  }
  @Post('leave')
  async handleLeaveParticipantNotify(
    @Body() body: { message: string; chatroomId: string },
  ) {
    const { message, status } = await this.adminService.notifyLeftAdmin(body);

    if (status != 200) {
      throw new HttpException(message, status);
    }
    return { status, message };
  }
  @Post('remove')
  async handleRemoveParticipantNotify(
    @Body() body: { message: string; chatroomId: string },
  ) {
    const { message, status } = await this.adminService.notifyRemoveAdmin(body);

    if (status != 200) {
      throw new HttpException(message, status);
    }
    return { status, message };
  }
}
