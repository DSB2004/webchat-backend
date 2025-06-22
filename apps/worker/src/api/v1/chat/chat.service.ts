import { Injectable } from '@nestjs/common';
import { db } from '@webchat-backend/db';
import { Message } from '@webchat-backend/types';
import { UtilService } from 'src/util/util.service';
@Injectable()
export class ChatService {
  constructor(private readonly util: UtilService) {}
  async addMessage({ message }: { message: Message }) {
    const { attachments, aesKeys, ...rest } = message;
    try {
      if (
        !(await this.util.checkChatroomPermission({
          userId: message.authorId,
          chatroomId: message.chatroomId,
        }))
      ) {
        console.warn('Skip processing due to permission error.');
        return;
      }
      await db.$transaction(async (tx) => {
        const createdMessage = await tx.message.create({
          data: {
            ...rest,
          },
        });
        const messageId = createdMessage.id;
        await tx.messageAESKey.createMany({
          data: aesKeys.map((key) => ({
            ...key,
            messageId,
          })),
        });
        await tx.attachment.createMany({
          data: attachments.map((att) => ({
            ...att,
            messageId,
          })),
        });
      });
    } catch (err) {
      console.error('[CHAT] Error creating new message', err);
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
        await tx.message.delete({
          where: {
            id: messageId,
          },
        });
        await tx.status.deleteMany({
          where: {
            messageId,
          },
        });
        await tx.messageAESKey.deleteMany({
          where: {
            messageId,
          },
        });
        await tx.attachment.deleteMany({
          where: {
            messageId,
          },
        });
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
            isUpdated: true,
          },
          data: {
            content,
          },
        });
      });
    } catch (err) {
      console.error('[CHAT] Error creating new message', err);
      throw new Error('Failed to send message');
    }
  }
}
