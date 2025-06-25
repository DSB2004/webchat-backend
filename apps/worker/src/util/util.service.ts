import { Injectable } from '@nestjs/common';
import { db, StatusType } from '@webchat-backend/db';

@Injectable()
export class UtilService {
  private readonly statusRank: Record<StatusType, number> = {
    PENDING: 0,
    SENT: 1,
    DELIVERED: 2,
    SEEN: 3,
  };

  async checkChatroomPermission({
    userId,
    chatroomId,
  }: {
    userId: string;
    chatroomId: string;
  }): Promise<boolean> {
    try {
      const chatroom = await db.chatroom.findUnique({
        where: {
          id: chatroomId,
        },
        include: {
          participants: true,
        },
      });

      return (
        chatroom?.participants?.some((user) => user.id === userId) ?? false
      );
    } catch (err) {
      console.error('checkChatroomPermission error', err);
      return false;
    }
  }

  async checkMessagePermission({
    userId,
    messageId,
  }: {
    userId: string;
    messageId: string;
  }): Promise<boolean> {
    try {
      const message = await db.message.findUnique({
        where: {
          id: messageId,
        },
      });
      return message?.authorId === userId;
    } catch (err) {
      console.error('checkMessagePermission error', err);
      return false;
    }
  }

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

      return this.statusRank[status] > this.statusRank[currentStatus.status];
    } catch (err) {
      console.error('checkStatusRanking error', err);
      return false;
    }
  }

  async checkMessageExist(id: string) {
    try {
      return (
        (await db.message.findUnique({
          where: {
            id,
          },
        })) !== null
      );
    } catch (err) {
      return false;
    }
  }

}
