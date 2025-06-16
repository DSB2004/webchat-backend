import { Injectable } from '@nestjs/common';
import { db } from '@webchat-backend/db';

@Injectable()
export class ChatroomService {
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
        where: { id },
      });
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
    type: 'GROUP' | 'CHAT';
  }) {
    try {
      const participantsList=await db.user.findMany({where:{
        id:{
          
        }
      }})
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
}
