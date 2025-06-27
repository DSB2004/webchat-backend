import { Injectable } from '@nestjs/common';
import { db } from '@webchat-backend/db';
import { Message } from '@webchat-backend/types';
import { UtilService } from 'src/util/util.service';
import { ChatPublisher } from './chat.publisher';
@Injectable()
export class ChatService {
  constructor(
    private readonly util: UtilService,
    private readonly publisher: ChatPublisher,
  ) {}
  async addMessage({ message }: { message: { userId: string } & Message }) {
    const { attachments, aesKeys, content, type, userId, chatroomId, id } =
      message;

    try {
      const hasPermission = await this.util.checkChatroomPermission({
        userId: userId,
        chatroomId: message.chatroomId,
      });

      if (!hasPermission) {
        console.warn('[CHAT] Permission denied. Skipping message processing.');
        return;
      }

      const messageId = await db.$transaction(async (tx) => {
        const createdMessage = await tx.message.create({
          data: {
            id,
            chatroomId,
            authorId: userId,
            content,
            type,
          },
        });

        const mid = createdMessage.id;

        if (aesKeys.length) {
          await tx.messageAESKey.createMany({
            data: aesKeys.map((key) => ({ ...key, messageId: mid })),
          });
        }

        if (attachments.length) {
          await tx.attachment.createMany({
            data: attachments.map((att) => ({ ...att, messageId: mid })),
          });
        }

        return mid;
      });

      await this.publisher.executeEvent(messageId);
    } catch (err: unknown) {
      // Smart error handling
      if (err instanceof Error) {
        console.error('[CHAT] Failed to create new message:', err.message);
        console.error('[CHAT] Stack:', err.stack);
      } else {
        console.error('[CHAT] Unknown error:', err);
      }

      // Optional: rethrow or handle
      throw new Error('Failed to send message');
    }
  }

  async deleteMessage({
    messageId,
    userId,
  }: {
    messageId: string;
    userId: string;
  }) {
    try {
      if (
        !(await this.util.checkMessagePermission({
          userId: userId,
          messageId,
        }))
      ) {
        console.warn('Skip processing due to permission error.');
        return;
      }
      await db.$transaction(async (tx) => {
        // await tx.message.delete({
        //   where: {
        //     id: messageId,
        //   },
        // });

        await tx.message.update({
          where: {
            id: messageId,
          },
          data: {
            isDeleted: true,
          },
        }); 

        // Sent messages will be stored for 1 month will seen messages are deleted after 24 hours and deliveried are deleted after 7 days 
  

        
        // await tx.status.deleteMany({
        //   where: {
        //     messageId,
        //   },
        // });
        // await tx.messageAESKey.deleteMany({
        //   where: {
        //     messageId,
        //   },
        // });
        // await tx.attachment.deleteMany({
        //   where: {
        //     messageId,
        //   },
        // });
      });
    } catch (err) {
      console.error('[CHAT] Error creating new message', err);
      throw new Error('Failed to send message');
    }
  }

  async updateMessage({
    messageId,
    userId,
    content,
  }: {
    messageId: string;
    userId: string;
    content: string;
  }) {
    try {
      if (
        !(await this.util.checkMessagePermission({
          userId: userId,
          messageId,
        }))
      ) {
        console.warn('Skip processing due to permission error.');
        return;
      }
      await db.$transaction(async (tx) => {
        await tx.message.update({
          where: {
            id: messageId,
          },
          data: {
            content,
            isUpdated: true,
          },
        });
      });
    } catch (err) {
      console.error('[CHAT] Error creating new message', err);
      throw new Error('Failed to send message');
    }
  }
}
