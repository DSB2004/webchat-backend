import { Injectable } from '@nestjs/common';
import { db } from '@webchat-backend/db';
@Injectable()
export class AdminService {
  async addAdmin({
    chatroomId,
    adminIds,
    adminId,
  }: {
    chatroomId: string;
    adminIds: string[];
    adminId: string;
  }) {
    try {
      const chatroom = await db.chatroom.findFirst({
        where: {
          id: chatroomId,
          admins: {
            some: {
              id: adminId,
            },
          },
        },
      });

      if (!chatroom) {
        return {
          status: 400,
          message: 'Admin access required or chatroom not found',
        };
      }

      await db.chatroomAdmin.createMany({
        data: adminIds.map((userId) => ({
          chatroomId,
          userId,
        })),
        skipDuplicates: true,
      });
      // notify method

      return {
        status: 200,
        message: 'Admin added',
      };
    } catch (err) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }
  async removeAdmin({
    chatroomId,
    adminIds,
    adminId,
  }: {
    chatroomId: string;
    adminIds: string[];
    adminId: string;
  }) {
    try {
      const chatroom = await db.chatroom.findFirst({
        where: {
          id: chatroomId,
          admins: {
            some: {
              id: adminId,
            },
          },
        },
        select: {
          createdById: true,
        },
      });

      if (!chatroom) {
        return {
          status: 400,
          message: 'Admin access required or chatroom not found',
        };
      }

      if (adminIds.includes(chatroom.createdById)) {
        return {
          status: 400,
          message: 'Cannot remove the owner of the chatroom',
        };
      }

      await db.chatroomAdmin.deleteMany({
        where: {
          chatroomId,
          userId: { in: adminIds },
        },
      });

      // notify method

      return {
        status: 200,
        message: 'Admin removed',
      };
    } catch (err) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }
}
