import { Injectable } from '@nestjs/common';
import { db } from '@webchat-backend/db';
import { UtilService } from 'src/util/util.service';
@Injectable()
export class BlockService {
  constructor(private readonly util: UtilService) {}
  async blockUser({
    blockedBy,
    toBlock,
    blockedByName,
  }: {
    blockedBy: string;
    toBlock: string;
    blockedByName: string;
  }) {
    try {
      await db.block.create({
        data: {
          blockedId: toBlock,
          blockerId: blockedBy,
        },
      });
      await this.util.makeGatewayRequest('/block/block-user', {
        message: `You have been blocked by ${blockedByName}`,
        userId: toBlock,
        blockedBy,
      });
      return { message: 'User has been blocked', status: 200 };
    } catch (err) {
      if (err.code === 'P2002') {
        return {
          status: 409,
          message: 'You have already blocked this user',
        };
      }
      return { status: 500, message: 'Internal Server Error' };
    }
  }
  async unBlockUser({
    blockedBy,
    toBlock,
    blockedByName,
  }: {
    blockedBy: string;
    toBlock: string;
    blockedByName: string;
  }) {
    try {
      await db.block.delete({
        where: {
          blockedId_blockerId: {
            blockedId: toBlock,
            blockerId: blockedBy,
          },
        },
      });
      await this.util.makeGatewayRequest('/block/unblock-user', {
        message: `You have been unblocked by ${blockedByName}`,
        userId: toBlock,
        blockedBy,
      });
      return { message: 'User has been unblocked', status: 200 };
    } catch (err) {
      if (err.code === 'P2025') {
        return { status: 409, message: 'You have already unblocked this user' };
      }
      console.log(err);
      return { status: 500, message: 'Internal Server Error' };
    }
  }
}
