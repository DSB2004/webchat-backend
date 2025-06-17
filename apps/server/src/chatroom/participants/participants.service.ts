import { Injectable } from '@nestjs/common';
import { db } from '@webchat-backend/db';

@Injectable()
export class ParticipantsService {
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

      await db.chatroom.update({
        where: { id: chatroomId },
        data: {
          participants: {
            connect: participantIds.map((id) => ({ id })),
          },
        },
      });

      // notify method

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
      await db.chatroom.update({
        where: { id: chatroomId },
        data: {
          participants: {
            disconnect: participantIds.map((id) => ({ id })),
          },
          admins: {
            disconnect: participantIds.map((id) => ({ id })),
          },
        },
      });

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
        },
      });

      if (!chatroom) {
        return {
          status: 400,
          message: 'Chatroom not found',
        };
      }

      await db.chatroom.update({
        where: { id: chatroomId },
        data: {
          participants: {
            disconnect: { id: userId },
          },
          admins: {
            disconnect: { id: userId },
          },
        },
      });

      // notify method

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
    try {
      const chatroom = await db.chatroom.findFirst({
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
      const updateChatroom = await db.chatroom.update({
        where: {
          inviteCode,
        },
        data: {
          participants: {
            connect: { id: userId },
          },
        },
      });

      // notify method

      return {
        status: 200,
        message: 'Joined chatroom',
        chatroomId: updateChatroom.id,
      };
    } catch (err) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }
}
