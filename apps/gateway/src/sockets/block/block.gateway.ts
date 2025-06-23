import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CLIENT_EVENT } from 'src/app.types';
import { UtilsService } from 'src/utils/utils.service';

@WebSocketGateway()
export class BlockGateway {
  constructor(private readonly util: UtilsService) {}
  @WebSocketServer()
  server: Server;
  async notifyBlockedUser({
    userId,
    blockedBy,
    message,
  }: {
    userId: string;
    blockedBy: string;
    message: string;
  }) {
    const socketId = await this.util.getUser({ userId });
    if (socketId) {
      this.server
        .to(socketId)
        .emit(CLIENT_EVENT.CLIENT_USER_BLOCK, { message, blockedBy });
    }
  }

  async notifyUnblockedUser({
    userId,
    message,
    blockedBy,
  }: {
    userId: string;
    blockedBy: string;
    message: string;
  }) {
    const socketId = await this.util.getUser({ userId });
    if (socketId) {
      this.server
        .to(socketId)
        .emit(CLIENT_EVENT.CLIENT_USER_UNBLOCK, { message, blockedBy });
    }
  }
}
