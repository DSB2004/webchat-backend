import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SERVER_EVENT, CLIENT_EVENT } from 'src/app.types';
import { Socket, Server } from 'socket.io';
import { UtilsService } from 'src/utils/utils.service';
import { StatusType, ChatroomType } from '@webchat-backend/db';

@WebSocketGateway()
export class EventsGateway {
  constructor(private readonly util: UtilsService) {}

  @WebSocketServer()
  server: Server;

  private emitError(client: Socket, message: string) {
    client.emit(CLIENT_EVENT.CLIENT_ERROR, { message });
  }

  private async validateBlockIfPersonalChat(
    client: Socket,
    userId: string,
    chatroomType?: string,
    receiverId?: string,
  ): Promise<boolean> {
    if (
      !chatroomType ||
      (chatroomType === ChatroomType.PERSONAL && !receiverId)
    ) {
      this.emitError(
        client,
        'chatroomType and receiverId required for personal chat',
      );
      return false;
    }

    if (
      chatroomType === ChatroomType.PERSONAL &&
      (await this.util.checkBlockUser({ senderId: userId, receiverId }))
    ) {
      this.emitError(client, 'User has blocked you');
      return false;
    }

    return true;
  }

  private async handleEvent({
    client,
    payload,
    event,
    endpoint,
  }: {
    client: Socket;
    payload: any;
    event: CLIENT_EVENT;
    endpoint: string;
  }) {
    const userId = await this.util.getUserId({ client });
    if (!userId) return;

    const { chatroomType, receiverId } = payload;

   
    const shouldValidateBlock =
      typeof chatroomType !== 'undefined' &&
      typeof payload.chatroomId === 'string';

    if (shouldValidateBlock) {
      const isValid = await this.validateBlockIfPersonalChat(
        client,
        userId,
        chatroomType,
        receiverId,
      );
      if (!isValid) return;
    }

    console.log('message:', payload);

    this.util.broadcastToParticipants({
      client,
      event,
      payload,
      server: this.server,
      chatroomId: payload.chatroomId,
    });

    await this.util.makeWorkerRequest(endpoint, { userId, ...payload });
  }

  @SubscribeMessage(SERVER_EVENT.SERVER_STATUS_MESSAGE)
  async handleMessageStatus(
    client: Socket,
    payload: {
      chatroomId: string;
      status: StatusType;
      messageId: string;
      chatroomType: string;
      receiverId?: string;
    },
  ) {
    return this.handleEvent({
      client,
      payload,
      event: CLIENT_EVENT.CLIENT_STATUS_MESSAGE,
      endpoint: '/events/status',
    });
  }

  @SubscribeMessage(SERVER_EVENT.SERVER_REACTION_MESSAGE)
  async handleReactionStatus(
    client: Socket,
    payload: {
      chatroomId: string;
      reaction: string;
      messageId: string;
      label: string;
      chatroomType: string;
      receiverId?: string;
    },
  ) {
    return this.handleEvent({
      client,
      payload,
      event: CLIENT_EVENT.CLIENT_REACTION_MESSAGE,
      endpoint: '/events/reaction',
    });
  }

  @SubscribeMessage(SERVER_EVENT.SERVER_STAR_MESSAGE)
  async handleStarMessage(
    client: Socket,
    payload: {
      chatroomId: string;
      messageId: string;
      chatroomType: string;
      receiverId?: string;
    },
  ) {
    return this.handleEvent({
      client,
      payload,
      event: CLIENT_EVENT.CLIENT_STAR_MESSAGE,
      endpoint: '/events/star',
    });
  }

  @SubscribeMessage(SERVER_EVENT.SERVER_PIN_MESSAGE)
  async handlePinMessage(
    client: Socket,
    payload: {
      chatroomId: string;
      messageId: string;
      chatroomType: string;
      receiverId?: string;
    },
  ) {
    return this.handleEvent({
      client,
      payload,
      event: CLIENT_EVENT.CLIENT_PIN_MESSAGE,
      endpoint: '/events/pin',
    });
  }
}
