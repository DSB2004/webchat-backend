import { Controller, Post, HttpException, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post('add')
  async handleAddParticipantNotify(
    @Body() body: { message: string; chatroomId },
  ) {
    try {
      const { message, status } = await this.adminService.notifyAddAdmin(body);

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
    @Body() body: { message: string; chatroomId },
  ) {
    try {
      const { message, status } =
        await this.adminService.notifyRemoveAdmin(body);

      if (status != 200) {
        throw new HttpException(message, status);
      }
      return { status, message };
    } catch (err) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
