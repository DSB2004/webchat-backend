import { Injectable } from '@nestjs/common';
import { db, StatusType } from '@webchat-backend/db';
import { UtilService } from 'src/util/util.service';
import { StatusParams, ReactionParams, EventParams } from 'src/app.types';

@Injectable()
export class EventsService {
  constructor(private readonly util: UtilService) {}

  private async isExisting(id: string) {
    try {
      return (await db.message.findUnique({ where: { id } })) !== null;
    } catch (err) {
      return false;
    }
  }

  private async permissionCheck(params: EventParams) {
    const exist = await this.isExisting(params.messageId);
    if (!exist) {
      console.warn('[EVENT] Message not found');
      return false;
    }

    const check = await this.util.checkChatroomPermission(params);
    if (!check) {
      console.error('[EVENT] Permission denied');
      return false;
    }
    return true;
  }

  async addUpdateStatus(params: StatusParams) {
    try {
      const permissionCheck = await this.permissionCheck(params);
      if (!permissionCheck) {
        console.warn('[EVENT] Permission denied');
        return;
      }
      const check = await this.util.checkStatusRanking(params);
      if (!check) {
        console.warn('[EVENT] Skipping update...status already on higher rank');
        return;
      }

      await db.status.upsert({
        where: {
          messageId_userId: {
            messageId: params.messageId,
            userId: params.userId,
          },
        },
        update: {
          status: params.status,
        },
        create: {
          messageId: params.messageId,
          userId: params.userId,
          status: params.status || StatusType.PENDING,
        },
      });
    } catch (err) {
      console.error('[EVENT] Error add or update status', err);
      throw new Error('Failed to add or update status');
    }
  }

  async addUpdateReaction(params: ReactionParams) {
    try {
      const permissionCheck = await this.permissionCheck(params);
      if (!permissionCheck) {
        console.warn('[EVENT] Permission denied');
        return;
      }

      await db.reaction.upsert({
        where: {
          messageId_userId: {
            messageId: params.messageId,
            userId: params.userId,
          },
        },
        update: {
          reaction: params.reaction,
          label: params.label,
        },
        create: {
          messageId: params.messageId,
          userId: params.userId,
          label: '',
          reaction: '',
        },
      });
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
  async tooglePin(params: EventParams) {
    try {
      const permissionCheck = await this.permissionCheck(params);
      if (!permissionCheck) {
        console.warn('[EVENT] Permission denied');
        return;
      }
      const message = await db.message.findUnique({
        where: { id: params.messageId },
        select: { isPined: true },
      });

      if (!message) {
        return { status: 404, message: 'Message not found' };
      }

      await db.message.update({
        where: { id: params.messageId },
        data: { isPined: !message.isPined },
      });
      return;
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
  async toogleStar(params: EventParams) {
    try {
      const permissionCheck = await this.permissionCheck(params);
      if (!permissionCheck) {
        console.warn('[EVENT] Permission denied');
        return;
      }
      const message = await db.message.findUnique({
        where: { id: params.messageId },
        select: { isStarred: true },
      });

      if (!message) {
        return { status: 404, message: 'Message not found' };
      }

      await db.message.update({
        where: { id: params.messageId },
        data: { isStarred: !message.isStarred },
      });
      return;
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
}
