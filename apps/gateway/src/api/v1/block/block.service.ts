import { Injectable } from '@nestjs/common';
import { BlockGateway } from 'src/sockets/block/block.gateway';

@Injectable()
export class BlockService {
  constructor(private readonly blockGateway: BlockGateway) {}
  async notifyBlockUser({
    message,
    userId,
    blockedBy,
  }: {
    message: string;
    userId: string;
    blockedBy: string;
  }) {
    try {
      await this.blockGateway.notifyBlockedUser({
        message,
        blockedBy,
        userId,
      });
      return { status: 200, message: 'Update sent via websocket' };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
  async notifyUnBlockUser({
    message,
    userId,
    blockedBy,
  }: {
    message: string;
    userId: string;
    blockedBy: string;
  }) {
    try {
      await this.blockGateway.notifyUnblockedUser({
        message,
        blockedBy,
        userId,
      });
      return { status: 200, message: 'Update sent via websocket' };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
}
