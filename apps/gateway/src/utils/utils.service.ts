import { Injectable } from '@nestjs/common';
import { db } from '@webchat-backend/db';
import { Socket, Server } from 'socket.io';
import { CLIENT_EVENT } from 'src/app.types';
import { redis } from '@webchat-backend/redis';
import { VerifyJWT } from '@webchat-backend/jwt';
import { TokenType } from '@webchat-backend/types';
import axios from 'axios';
import { Axios } from 'axios';
import { StatusType } from '@webchat-backend/db';
@Injectable()
export class UtilsService {
  private SOCKET_USER_KEY = 'socket-to-user';
  private USER_SOCKET_KEY = 'user-to-socket';
  private CHATROOM_PARTICIPANT_LIST_KEY = 'chatroom-participants:';
  private BLOCK_USER_MAP_KEY = 'blocked-user';
  async connectUser({
    userId,
    socketId,
  }: {
    userId: string;
    socketId: string;
  }) {
    try {
      // const existingSocketId = await redis.hget(this.USER_SOCKET_KEY, userId);

      // if (existingSocketId) {
      //   return false;
      // }
      await redis.hset(this.SOCKET_USER_KEY, socketId, userId);
      await redis.hset(this.USER_SOCKET_KEY, userId, socketId);
      return true;
    } catch (err) {
      return false;
    }
  }
  async getUserfromDB({ accessToken }: { accessToken: string }) {
    try {
      const _user = await VerifyJWT<TokenType>(accessToken);
      if (!_user) return null;

      const user = await db.user.findUnique({
        where: {
          email: _user.email,
        },
        select: {
          id: true,
        },
      });
      return user;
    } catch (err) {
      return null;
    }
  }
  async getUser({ userId, socketId }: { userId?: string; socketId?: string }) {
    try {
      if (socketId) {
        return await redis.hget(this.SOCKET_USER_KEY, socketId);
      } else if (userId) {
        return await redis.hget(this.USER_SOCKET_KEY, userId);
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async disconnectUser({
    userId,
    socketId,
  }: {
    userId?: string;
    socketId?: string;
  }) {
    try {
      if (socketId) {
        const userId = await this.getUser({ socketId });
        if (userId) {
          await redis.hdel(this.USER_SOCKET_KEY, userId);
        }
        await redis.hdel(this.SOCKET_USER_KEY, socketId);
        return true;
      } else if (userId) {
        const socketId = await this.getUser({ userId });
        if (socketId) {
          await redis.hdel(this.SOCKET_USER_KEY, socketId);
        }
        await redis.hdel(this.USER_SOCKET_KEY, userId);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  async getChatroomParticipants(id: string) {
    try {
      const check = await redis.get(this.CHATROOM_PARTICIPANT_LIST_KEY + id);
      if (check != null) {
        return JSON.parse(check) as string[];
      }
      const participantList = await db.chatroom.findUnique({
        where: { id },
        select: {
          participants: {
            select: {
              user: {
                select: { id: true },
              },
            },
          },
        },
      });
      if (!participantList) return [];
      const filterArray = participantList.participants.map(
        (ele) => ele.user.id,
      );

      await redis.set(
        this.CHATROOM_PARTICIPANT_LIST_KEY + id,
        JSON.stringify(filterArray),
        'EX',
        300,
      );
      return filterArray;
    } catch (err) {
      return [];
    }
  }
  async purgeCache(chatroomId: string) {
    await redis.del(this.CHATROOM_PARTICIPANT_LIST_KEY + chatroomId);
  }
  async broadcastToParticipants({
    client,
    server,
    chatroomId,
    event,
    payload,
  }: {
    client: Socket | null;
    server: Server;
    chatroomId: string;
    event: CLIENT_EVENT;
    payload: any;
  }) {
    const participants = await this.getChatroomParticipants(chatroomId);

    const participantList = await Promise.all(
      participants.map((userId) =>
        this.getUser({ userId }).then((userSocketId) => {
          return { id: userId, socketId: userSocketId };
        }),
      ),
    );

    for (const user of participantList) {
      if (!user.socketId) {
        // send fallback notification
        continue;
      }

      if (!client || user.socketId !== client.id) {
        server.to(user.socketId).emit(event, payload);
      }
    }
  }
  async broadcastToUser({
    client,
    server,
    event,
    payload,
    userId,
  }: {
    client: Socket | null;
    server: Server;
    userId: string;
    event: CLIENT_EVENT;
    payload: any;
  }) {
    const user = await this.getUser({ userId }).then((userSocketId) => {
      return { id: userId, socketId: userSocketId };
    });

    if (!user.socketId) {
      // send fallback notification
      return;
    }

    if (!client || user.socketId !== client.id) {
      server.to(user.socketId).emit(event, payload);
    }
  }
  private readonly workerAxios: Axios = axios.create({
    baseURL: (process.env.WORKER_URL as string) || 'http://localhost:3002',
    headers: {
      INTERNAL_API_KEY: process.env.INTERNAL_API_KEY,
    },
  });
  async makeWorkerRequest(url: string, payload: any) {
    try {
      console.log(process.env.WORKER_URL);
      await this.workerAxios.post(url, payload);
    } catch (err) {
      console.error('Error while sending request', err);
    }
  }

  async checkOwnership({
    userId,
    messageId,
  }: {
    userId: string;
    messageId: string;
  }) {
    const cache = await redis.get(`${messageId}:${userId}`);
    if (cache != null) return JSON.parse(cache) as boolean;
    const res =
      (await db.message.findUnique({
        where: {
          id: messageId,
          authorId: userId,
        },
      })) != null;
    await redis.set(`${messageId}:${userId}`, JSON.stringify(res));
    return res;
  }

  async getUserId({ client }: { client: Socket }) {
    const token = client.handshake.headers?.auth as string;
    const user = await this.getUserfromDB({ accessToken: token });
    if (!user) {
      client.disconnect();
      return null;
    }
    const { id } = user;
    return id as string | null;
  }

  async checkBlockUser({ senderId, receiverId }) {
    try {
      const res = await db.block.findUnique({
        where: {
          blockedId_blockerId: {
            blockedId: senderId,
            blockerId: receiverId,
          },
        },
      });
      return res != null;
    } catch (err) {
      return false;
    }
  }
  private readonly statusRank: Record<StatusType, number> = {
    PENDING: 0,
    SENT: 1,
    DELIVERED: 2,
    SEEN: 3,
  };
  async checkStatusRanking({
    status,
    messageId,
    userId,
  }: {
    status: StatusType;
    messageId: string;
    userId: string;
  }): Promise<boolean> {
    try {
      const currentStatus = await db.status.findUnique({
        where: {
          messageId_userId: {
            messageId,
            userId,
          },
        },
        select: {
          status: true,
        },
      });

      if (!currentStatus) return true;

      return this.statusRank[status] >= this.statusRank[currentStatus.status];
    } catch (err) {
      console.error('checkStatusRanking error', err);
      return false;
    }
  }
}
