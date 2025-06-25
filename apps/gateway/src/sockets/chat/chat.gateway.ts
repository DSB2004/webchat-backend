import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from '@webchat-backend/types';
import { CLIENT_EVENT, SERVER_EVENT } from 'src/app.types';
import { UtilsService } from 'src/utils/utils.service';
import { ChatroomType } from '@webchat-backend/db';

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly util: UtilsService) {}

  @WebSocketServer()
  server: Server;

  private async validatePersonalChat(
    client: Socket,
    userId: string,
    chatroomType: ChatroomType,
    receiverId?: string,
  ): Promise<boolean> {
    if (
      !chatroomType ||
      (chatroomType === ChatroomType.PERSONAL && !receiverId)
    ) {
      client.emit(CLIENT_EVENT.CLIENT_ERROR, {
        message: 'chatroomType and receiverId required for personal chat',
      });
      return false;
    }

    if (
      chatroomType === ChatroomType.PERSONAL &&
      (await this.util.checkBlockUser({ senderId: userId, receiverId }))
    ) {
      client.emit(CLIENT_EVENT.CLIENT_ERROR, {
        message: 'User has blocked you',
      });
      return false;
    }

    return true;
  }

  private emitUnauthorized(client: Socket) {
    client.emit(CLIENT_EVENT.CLIENT_ERROR, {
      message: 'Unauthorised Request',
    });
  }

  @SubscribeMessage(SERVER_EVENT.SERVER_ADD_MESSAGE)
  async handleMessageSent(
    client: Socket,
    payload: { receiverId?: string } & Message,
  ) {
    const id = await this.util.getUserId({ client });
    if (!id) return;
    const valid = await this.validatePersonalChat(
      client,
      id,
      payload.chatroomType,
      payload.receiverId,
    );
    if (!valid) return;

    console.log('message:', payload);

    this.util.broadcastToParticipants({
      client,
      event: CLIENT_EVENT.CLIENT_ADD_MESSAGE,
      payload,
      server: this.server,
      chatroomId: payload.chatroomId,
    });

    await this.util.makeWorkerRequest('/chat/add', {
      ...payload,
      authorId: id,
    });
  }

  @SubscribeMessage(SERVER_EVENT.SERVER_UPDATE_MESSAGE)
  async handleMessageUpdate(
    client: Socket,
    payload: {
      messageId: string;
      content: string;
      chatroomId: string;
      chatroomType: ChatroomType;
      receiverId?: string;
    },
  ) {
    const id = await this.util.getUserId({ client });
    if (!id) return;

    const ownsMessage = await this.util.checkOwnership({
      messageId: payload.messageId,
      userId: id,
    });

    if (!ownsMessage) {
      this.emitUnauthorized(client);
      return;
    }

    const valid = await this.validatePersonalChat(
      client,
      id,
      payload.chatroomType,
      payload.receiverId,
    );
    if (!valid) return;

    console.log('message:', payload);

    this.util.broadcastToParticipants({
      client,
      event: CLIENT_EVENT.CLIENT_UPDATE_MESSAGE,
      payload,
      server: this.server,
      chatroomId: payload.chatroomId,
    });

    await this.util.makeWorkerRequest('/chat/update', {
      ...payload,
      userId: id,
    });
  }

  @SubscribeMessage(SERVER_EVENT.SERVER_DELETE_MESSAGE)
  async handleMessageDelete(
    client: Socket,
    payload: {
      messageId: string;
      chatroomId: string;
      chatroomType: ChatroomType;
      receiverId?: string;
    },
  ) {
    const id = await this.util.getUserId({ client });
    if (!id) return;

    const valid = await this.validatePersonalChat(
      client,
      id,
      payload.chatroomType,
      payload.receiverId,
    );
    if (!valid) return;

    const ownsMessage = await this.util.checkOwnership({
      messageId: payload.messageId,
      userId: id,
    });

    if (!ownsMessage) {
      this.emitUnauthorized(client);
      return;
    }

    console.log('message:', payload);

    this.util.broadcastToParticipants({
      client,
      event: CLIENT_EVENT.CLIENT_DELETE_MESSAGE,
      payload,
      server: this.server,
      chatroomId: payload.chatroomId,
    });

    await this.util.makeWorkerRequest('/chat/delete', {
      ...payload,
      userId: id,
    });
  }
}
