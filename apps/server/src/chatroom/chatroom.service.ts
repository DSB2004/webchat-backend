import { Injectable } from '@nestjs/common';
import { db } from '@webchat-backend/db';
import { SharedService } from 'src/shared/shared.service';

@Injectable()
export class ChatroomService {
  constructor(private readonly sharedService: SharedService) {}
  async getChatroom(id: string) {
    try {
      const chatroom = await db.chatroom.findUnique({
        select: {
          id: true,
          createdAt: true,
          description: true,
          profilePic: true,
          type: true,
          name: true,
          createdBy: {
            select: {
              id: true,
              username: true,
              profilePic: true,
            },
          },
          participants: {
            select: {
              id: true,
              username: true,
              profilePic: true,
            },
          },
          admins: {
            select: {
              id: true,
              username: true,
              profilePic: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            select: {
              id: true,
              content: true,
              createdAt: true,
              type: true,
              author: {
                select: {
                  id: true,
                  username: true,
                  profilePic: true,
                },
              },
            },
          },
        },
        where: { id },
      });
      return { status: 500, message: 'Internal Server Error', chatroom };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }

  async getChatroomByInviteCode(inviteCode: string) {
    try {
      const chatroom = await db.chatroom.findUnique({
        select: {
          id: true,
          createdAt: true,
          description: true,
          profilePic: true,
          type: true,
          name: true,
          createdBy: {
            select: {
              id: true,
              username: true,
              profilePic: true,
            },
          },
          participants: {
            select: {
              id: true,
              username: true,
              profilePic: true,
            },
          },
          admins: {
            select: {
              id: true,
              username: true,
              profilePic: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            select: {
              id: true,
              content: true,
              createdAt: true,
              type: true,
              author: {
                select: {
                  id: true,
                  username: true,
                  profilePic: true,
                },
              },
            },
          },
        },
        where: { inviteCode },
      });
      return { status: 500, message: 'Internal Server Error', chatroom };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }

  async createChatroom({
    participants,
    owner,
    type,
  }: {
    participants: string[];
    owner: string;
    type: 'GROUP' | 'PERSONAL';
  }) {
    try {
      if (type === 'PERSONAL') {
        if (participants.length !== 2) {
          return {
            status: 400,
            message: 'PERSONAL chat must have exactly 2 participants',
          };
        }
        const [user1, user2] = participants.sort();
        const existing = await db.chatroom.findFirst({
          where: {
            type: 'PERSONAL',
            participants: {
              every: {
                id: { in: [user1, user2] },
              },
            },
          },

          include: { participants: true },
        });
        if (existing) {
          const chatroom = await this.getChatroom(existing.id);
          return {
            status: 200,
            message: 'Chatroom exist',
            chatroom,
          };
        }
      }
      const newChatroom = await db.chatroom.create({
        data: {
          inviteCode: this.sharedService.generateRandomCode(),
          participants: {
            connect: participants.map((id) => ({ id })),
          },
          admins: {
            connect: { id: owner },
          },
          type: type,
          createdBy: { connect: { id: owner } },
        },
      });
      if (newChatroom) {
        const chatroom = await this.getChatroom(newChatroom.id);
        return {
          status: 200,
          message: 'Chatroom created',
          chatroom,
        };
      }
      return {
        status: 500,
        message: 'Error creating chatroom',
      };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }

  async searchChatroom({
    searchUsername,
    email,
  }: {
    searchUsername?: string;
    email: string;
  }) {
    try {
      const user = await db.user.findUnique({ where: { email } });
      if (!user) return { status: 400, message: 'User not found' };
      const { id } = user;

      const whereClause: any[] = [
        {
          participants: {
            some: { id },
          },
        },
      ];

      if (searchUsername) {
        whereClause.push({
          participants: {
            some: {
              username: {
                contains: searchUsername,
                mode: 'insensitive',
              },
            },
          },
        });
      }

      const existingchats = await db.chatroom.findMany({
        where: { AND: whereClause },
        select: {
          id: true,
          createdAt: true,
          description: true,
          profilePic: true,
          type: true,
          name: true,
          createdBy: {
            select: {
              id: true,
              username: true,
              profilePic: true,
            },
          },
          participants: {
            select: {
              id: true,
              username: true,
              profilePic: true,
            },
          },
          admins: {
            select: {
              id: true,
              username: true,
              profilePic: true,
            },
          },
          messages: {
            take: 1,
            orderBy: {
              createdAt: 'desc',
            },
            select: {
              id: true,
              content: true,
              createdAt: true,
              type: true,
              author: {
                select: {
                  id: true,
                  username: true,
                  profilePic: true,
                },
              },
            },
          },
        },
      });

      const newChats: any[] = [];

      if (searchUsername) {
        const existingChatUserIds = new Set<string>();
        existingchats.forEach((chat) => {
          chat.participants.forEach((p) => {
            if (p.id !== id) existingChatUserIds.add(p.id);
          });
        });

        const unmatchedUsers = await db.user.findMany({
          where: {
            username: {
              contains: searchUsername,
              mode: 'insensitive',
            },
            id: {
              notIn: Array.from(existingChatUserIds).concat(id),
            },
          },
          select: {
            id: true,
            username: true,
            profilePic: true,
          },
        });

        for (const u of unmatchedUsers) {
          newChats.push({
            id: null,
            type: 'PERSONAL',
            createdAt: null,
            description: null,
            profilePic: u.profilePic,
            name: u.username,
            createdBy: null,
            participants: [u],
            admins: [],
            messages: [],
            chatExist: false,
          });
        }
      }

      const chats = [
        ...existingchats.map((chat) => ({
          ...chat,
          chatExist: true,
        })),
        ...newChats,
      ];

      return { status: 200, message: 'Chats found', chats };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }

  async getChatroomInviteCode({ id, email }: { id: string; email: string }) {
    try {
      const user = await db.user.findUnique({ where: { email } });
      if (!user) return { status: 400, message: 'User not found' };
      const { id: adminId } = user;

      const chatroom = await db.chatroom.findUnique({
        where: {
          id,
          admins: {
            some: {
              id: adminId,
            },
          },
        },
        select: {
          inviteCode: true,
        },
      });
      if (!chatroom) {
        return {
          status: 400,
          message: 'Chatroom not found or only admin can get the invite code',
        };
      }

      return {
        status: 200,
        message: 'Invite Code for Chatroom',
        inviteCode: chatroom.inviteCode,
      };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
}
