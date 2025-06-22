import { Injectable } from '@nestjs/common';
import { db, StatusType } from '@webchat-backend/db';
import { UtilService } from 'src/util/util.service';
import { EventParams } from 'src/app.types';
interface StatusParams extends EventParams {
  status: StatusType;
}
interface ReactionParams extends EventParams {
  label: string;
  reaction: string;
}

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
  async addUpdateStatus(params: StatusParams) {
    try {
      const exist = await this.isExisting(params.messageId);
      if (!exist) {
        console.error('[EVENT] Fuck Race condition happened');
        throw new Error('Failed to add or update status');
      }

      const check =
        (await this.util.checkStatusRanking(params)) &&
        (await this.util.checkChatroomPermission(params));
      if (!check) {
        console.error(
          '[EVENT] Permission denied or status already on higher ranking ',
        );
        throw new Error('Failed to add or update status');
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
          status: StatusType.PENDING,
        },
      });
    } catch (err) {
      console.error('[EVENT] Error add or update status', err);
      throw new Error('Failed to add or update status');
    }
  }
  async addUpdateReaction(params: ReactionParams) {
    try {
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
  async tooglePin() {
    try {
      // await db.
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
  async toogleStar() {
    try {
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }

  
}
