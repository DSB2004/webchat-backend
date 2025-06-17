import { Injectable } from '@nestjs/common';
import { db } from '@webchat-backend/db';

@Injectable()
export class MessageService {
  async getMessages({
    chatroomId,
    page = '1',
    limit = '20',
  }: {
    chatroomId: string;
    page?: string | number;
    limit?: string | number;
  }) {
    try {
      page = Number(page);
      limit = Number(limit);

      
      const skip = (page - 1) * limit;

      const [total, messages] = await Promise.all([
        db.message.count({
          where: { chatroomId },
        }),

        db.message.findMany({
          where: { chatroomId },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,

          select: {
            id: true,
            content: true,
            createdAt: true,
            type: true,
            attachments: {
              select: {
                id: true,
                type: true,
                src: true,
                name: true,
              },
            },
            status: {
              select: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    profilePic: true,
                  },
                },
                status: true,
              },
            },
            author: {
              select: {
                id: true,
                username: true,
                profilePic: true,
              },
            },
            isDeleted: true,
            isPined: true,
            isStarred: true,
            isUpdated: true,
            chatroomId: true,
            updatedAt: true,
          },
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        page,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < pages ? page + 1 : null,
        messages,
        total,
        status: 200,
        message: 'Messages Found',
      };
    } catch (err) {
      return { messsage: 'Internal Server Error', status: 500 };
    }
  }
}
