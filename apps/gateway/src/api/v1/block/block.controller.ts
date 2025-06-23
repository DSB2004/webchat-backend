import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { BlockService } from './block.service';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}
  @Post('block-user')
  async handleBlockUserNotify(
    @Body() body: { message: string; userId: string; blockedBy: string },
  ) {
    const { message, status } = await this.blockService.notifyBlockUser(body);

    if (status != 200) {
      throw new HttpException(message, status);
    }
    return { status, message };
  }
  @Post('unblock-user')
  async handleUnBlockUserNotify(
    @Body() body: { message: string; userId: string; blockedBy: string },
  ) {
    const { message, status } = await this.blockService.notifyUnBlockUser(body);

    if (status != 200) {
      throw new HttpException(message, status);
    }
    return { status, message };
  }
}
