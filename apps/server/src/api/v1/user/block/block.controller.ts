import {
  Controller,
  Patch,
  Param,
  Headers,
  HttpException,
} from '@nestjs/common';
import { BlockService } from './block.service';
import { UtilService } from 'src/util/util.service';

@Controller('block')
export class BlockController {
  constructor(
    private readonly blockService: BlockService,
    private readonly utilService: UtilService,
  ) {}

  @Patch('block-user/:toBlock')
  async handleBlockUserNotify(
    @Param('toBlock') toBlock: string,
    @Headers('authorization') accessToken: string,
  ) {
    const user = await this.utilService.getUserInfo({ accessToken });
    if (!user) throw new HttpException('Unauthorized', 401);
    const blockedBy = user.id;

    const { message, status } = await this.blockService.blockUser({
      blockedBy,
      toBlock,
      blockedByName: user.username,
    });

    if (status !== 200) {
      throw new HttpException(message, status);
    }

    return { status, message };
  }

  @Patch('unblock-user/:toBlock')
  async handleUnBlockUserNotify(
    @Param('toBlock') toBlock: string,
    @Headers('authorization') accessToken: string,
  ) {
    const user = await this.utilService.getUserInfo({ accessToken });
    if (!user) throw new HttpException('Unauthorized', 401);
    const blockedBy = user.id;

    const { message, status } = await this.blockService.unBlockUser({
      blockedBy,
      blockedByName: user.username,
      toBlock,
    });

    if (status !== 200) {
      throw new HttpException(message, status);
    }

    return { status, message };
  }
}
