import { Injectable } from '@nestjs/common';
import { db, Chatroom } from '@webchat-backend/db';
import { UtilService } from 'src/util/util.service';
@Injectable()
export class ParticipantsService {
  constructor(private readonly util: UtilService) {}
  async addParticipant({
    chatroomId,
    participantIds,
    adminId,
  }: {
    chatroomId: string;
    participantIds: string[];
    adminId: string;
  }) {
    try {
      const chatroom = await db.chatroom.findFirst({
        where: {
          type: 'GROUP',
          id: chatroomId,
          admins: {
            some: {
              userId: adminId,
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

      const addedUsers: { id: string; username: string }[] = [];

      for (const userId of participantIds) {
        try {
          await db.chatroomParticipant.create({
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
        await this.util.makeGatewayRequest('/participant/add', {
          chatroomId,
          message: `${user.username} was added to the group`,
        });
      }

      return {
        status: 200,
        message: 'Participants added into chatroom',
      };
    } catch (err) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }
  async removeParticipant({
    chatroomId,
    participantIds,
    adminId,
  }: {
    chatroomId: string;
    participantIds: string[];
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
          type: 'GROUP',
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

      if (participantIds.includes(chatroom.createdById)) {
        return {
          status: 400,
          message: 'Cannot remove the owner of the chatroom',
        };
      }
      await db.$transaction([
        db.chatroomParticipant.deleteMany({
          where: {
            chatroomId,
            userId: { in: participantIds },
          },
        }),
        db.chatroomAdmin.deleteMany({
          where: {
            chatroomId,
            userId: { in: participantIds },
          },
        }),
      ]);

      const users = await db.user.findMany({
        where: {
          id: {
            in: participantIds,
          },
        },
        select: {
          id: true,
          username: true,
        },
      });

      for (const user of users) {
        await this.util.makeGatewayRequest('/participant/remove', {
          chatroomId,
          message: `${user.username} was removed from the group`,
        });
      }

      // notify method

      return {
        status: 200,
        message: 'Participants removed from chatroom',
      };
    } catch (err) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }

  async leaveChatroom({
    chatroomId,
    userId,
  }: {
    chatroomId: string;
    userId: string;
  }) {
    try {
      const chatroom = await db.chatroom.findFirst({
        where: {
          id: chatroomId,
          type: 'GROUP',
        },
      });

      if (!chatroom) {
        return {
          status: 400,
          message: 'Chatroom not found',
        };
      }
      await db.$transaction([
        db.chatroomParticipant.deleteMany({
          where: {
            chatroomId,
            userId,
          },
        }),
        db.chatroomAdmin.deleteMany({
          where: {
            chatroomId,
            userId,
          },
        }),
      ]);
      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          username: true,
        },
      });
      if (user) {
        await this.util.makeGatewayRequest('/participant/leave', {
          chatroomId,
          message: `${user.username} left the group`,
        });
      }

      return {
        status: 200,
        message: 'Left chatroom',
      };
    } catch (err) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }

  async joinChatroom({
    userId,
    inviteCode,
  }: {
    userId: string;
    inviteCode: string;
  }) {
    let chatroom: Chatroom | null = null;

    try {
      chatroom = await db.chatroom.findFirst({
        where: {
          inviteCode,
          type: 'GROUP',
        },
      });

      if (!chatroom) {
        return {
          status: 400,
          message: 'Chatroom not found',
        };
      }

      await db.chatroomParticipant.create({
        data: {
          chatroomId: chatroom.id,
          userId,
        },
      });

      const user = await db.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true },
      });

      if (user) {
        await this.util.makeGatewayRequest('/participant/join', {
          chatroomId: chatroom.id,
          message: `${user.username} joined the group via invite link`,
        });
      }

      return {
        status: 200,
        message: 'Joined chatroom',
        chatroomId: chatroom.id,
      };
    } catch (err: any) {
      if (err.code === 'P2002') {
        return {
          status: 409,
          message: 'You are already in the chatroom',
          chatroomId: chatroom ? chatroom.id : null,
        };
      }

      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }
}
