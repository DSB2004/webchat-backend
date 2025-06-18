import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UtilsService } from 'src/utils/utils.service';
import { CLIENT_EVENT } from 'src/app.types';
@WebSocketGateway()
export class ParticipantGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly util: UtilsService) {}

  async notifyJoinPariticipant(payload: any) {
    console.log('message:', payload);
    await this.util.broadcastToParticipants({
      client: null,
      event: CLIENT_EVENT.CLIENT_JOIN_PARTICIPANT,
      payload,
      server: this.server,
      chatroomId: payload.chatroomId,
    });
    // worker api for adding message to db
  }

  async notifyRemovePariticipant(payload: any) {
    console.log('message:', payload);
    await this.util.broadcastToParticipants({
      client: null,
      event: CLIENT_EVENT.CLIENT_REMOVE_PARTICIPANT,
      payload,
      server: this.server,
      chatroomId: payload.chatroomId,
    });
  }

  async notifyAddPariticipant(payload: any) {
    console.log('message:', payload);
    await this.util.broadcastToParticipants({
      client: null,
      event: CLIENT_EVENT.CLIENT_ADD_PARTICIPANT,
      payload,
      server: this.server,
      chatroomId: payload.chatroomId,
    });
  }

  async notifyLeftPariticipant(payload: any) {
    console.log('message:', payload);
    await this.util.broadcastToParticipants({
      client: null,
      event: CLIENT_EVENT.CLIENT_LEAVE_PARTICIPANT,
      payload,
      server: this.server,
      chatroomId: payload.chatroomId,
    });
  }
}
