import { Injectable } from '@nestjs/common';
import { db } from '@webchat-backend/db';
import { UtilService } from 'src/util/util.service';
@Injectable()
export class AdminService {
  constructor(private readonly util: UtilService) {}

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
            some: { userId: adminId },
          },
        },
      });

      if (!chatroom) {
        return {
          status: 400,
          message: 'Admin access required or chatroom not found',
        };
      }

      const addedUsers: { id: string; username: string }[] = [];

      for (const userId of adminIds) {
        try {
          await db.chatroomAdmin.create({
            data: { chatroomId, userId },
          });

          const user = await db.user.findUnique({
            where: { id: userId },
            select: { id: true, username: true },
          });

          if (user) addedUsers.push(user);
        } catch (err: any) {
          if (err.code !== 'P2002') {
            //  skip any errors
          }
        }
      }

      for (const user of addedUsers) {
        await this.util.makeGatewayRequest('/admin/add', {
          chatroomId,
          message: `${user.username} was added as an admin`,
        });
      }

      return {
        status: 200,
        message: 'Admins added',
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
            some: { userId: adminId },
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

      const users = await db.user.findMany({
        where: {
          id: { in: adminIds },
        },
        select: {
          id: true,
          username: true,
        },
      });

      for (const user of users) {
        await this.util.makeGatewayRequest('/admin/remove', {
          chatroomId,
          message: `${user.username} was removed as an admin`,
        });
      }

      return {
        status: 200,
        message: 'Admins removed',
      };
    } catch (err) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }

  async leaveAdmin({
    chatroomId,
    adminId,
  }: {
    chatroomId: string;
    adminId: string;
  }) {
    try {
      const chatroom = await db.chatroom.findFirst({
        where: {
          id: chatroomId,
          admins: {
            some: { userId: adminId },
          },
        },
        select: {
          createdById: true,
        },
      });

      if (!chatroom) {
        return {
          status: 400,
          message: 'Admin not found in chatroom',
        };
      }

      if (adminId === chatroom.createdById) {
        return {
          status: 400,
          message: 'Owner cannot leave admin role',
        };
      }

      await db.chatroomAdmin.delete({
        where: {
          chatroomId_userId: {
            chatroomId,
            userId: adminId,
          },
        },
      });

      const user = await db.user.findUnique({
        where: { id: adminId },
        select: {
          username: true,
        },
      });

      if (user) {
        await this.util.makeGatewayRequest('/admin/leave', {
          chatroomId,
          message: `${user.username} left the admin role`,
        });
      }

      return {
        status: 200,
        message: 'Left admin role',
      };
    } catch (err) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }
}
