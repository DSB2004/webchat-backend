import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UtilsService } from 'src/utils/utils.service';
import { CLIENT_EVENT } from 'src/app.types';
@WebSocketGateway()
export class AdminGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly util: UtilsService) {}

  async notifyAddAdmin(payload: any) {
    console.log('message:', payload);
    await this.util.broadcastToParticipants({
      client: null,
      event: CLIENT_EVENT.CLIENT_ADD_ADMIN,
      payload,
      server: this.server,
      chatroomId: payload.chatroomId,
    });
  }
  async notifyLeftAdmin(payload: any) {
    console.log('message:', payload);
    await this.util.broadcastToParticipants({
      client: null,
      event: CLIENT_EVENT.CLIENT_LEAVE_ADMIN,
      payload,
      server: this.server,
      chatroomId: payload.chatroomId,
    });
  }

  async notifyRemoveAdmin(payload: any) {
    console.log('message:', payload);
    await this.util.broadcastToParticipants({
      client: null,
      event: CLIENT_EVENT.CLIENT_REMOVE_ADMIN,
      payload,
      server: this.server,
      chatroomId: payload.chatroomId,
    });
  }
}
