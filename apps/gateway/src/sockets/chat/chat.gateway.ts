import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from '@webchat-backend/types';
import { CLIENT_EVENT, SERVER_EVENT } from 'src/app.types';
import { UtilsService } from 'src/utils/utils.service';
@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly util: UtilsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(SERVER_EVENT.SERVER_ADD_MESSAGE)
  async handleMessageSent(client: Socket, payload: Message) {
    console.log('message:', payload);
    this.util.broadcastToParticipants({
      client,
      event: CLIENT_EVENT.CLIENT_ADD_MESSAGE,
      payload,
      server: this.server,
      chatroomId: payload.chatroomId,
    });
    // add message worker api
  }

  @SubscribeMessage(SERVER_EVENT.SERVER_UPDATE_MESSAGE)
  async handleMessageUpdate(client: Socket, payload: Message) {
    console.log('message:', payload);
    this.util.broadcastToParticipants({
      client,
      event: CLIENT_EVENT.CLIENT_UPDATE_MESSAGE,
      payload,
      server: this.server,
      chatroomId: payload.chatroomId,
    });
    // update message worker api
  }

  @SubscribeMessage(SERVER_EVENT.SERVER_DELETE_MESSAGE)
  async handleMessageDelete(client: Socket, payload: Message) {
    console.log('message:', payload);
    this.util.broadcastToParticipants({
      client,
      event: CLIENT_EVENT.CLIENT_DELETE_MESSAGE,
      payload,
      server: this.server,
      chatroomId: payload.chatroomId,
    });
    // delete message worker api
  }
  @SubscribeMessage(SERVER_EVENT.SERVER_CLEAR_MESSAGE)
  async handleMessageClear(client: Socket, payload: Message) {
    console.log('message:', payload);
    this.util.broadcastToParticipants({
      client,
      event: CLIENT_EVENT.CLIENT_CLEAR_MESSAGE,
      payload,
      server: this.server,
      chatroomId: payload.chatroomId,
    });
    // clear message api
  }
  @SubscribeMessage(SERVER_EVENT.SERVER_STATUS_MESSAGE)
  async handleMessageStatus(client: Socket, payload: Message) {
    console.log('message:', payload);
    this.util.broadcastToParticipants({
      client,
      event: CLIENT_EVENT.CLIENT_STATUS_MESSAGE,
      payload,
      server: this.server,
      chatroomId: payload.chatroomId,
    });
    // status message api
  }
}
