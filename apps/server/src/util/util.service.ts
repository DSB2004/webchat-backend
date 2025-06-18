import { Injectable } from '@nestjs/common';
import { db } from '@webchat-backend/db';
import { VerifyJWT } from '@webchat-backend/jwt';
import { TokenType } from 'src/app.types';
@Injectable()
export class UtilService {
  async existAuth({ email }: { email: string }) {
    try {
      return await db.auth.findUnique({ where: { email } });
    } catch (err) {
      return null;
    }
  }
  async getUser({ accessToken }: { accessToken: string }) {
    try {
      return await VerifyJWT<TokenType>(accessToken);
    } catch (err) {
      return null;
    }
  }
  async existUser({ email }: { email: string }) {
    try {
      return await db.user.findUnique({ where: { email } });
    } catch (err) {
      return null;
    }
  }

  async getUserInfo({ accessToken }: { accessToken: string }) {
    try {
      const user = await VerifyJWT<TokenType>(accessToken);
      if (!user) return null;

      const { email } = user;

      return db.user.findUnique({
        where: {
          email,
        },
        select: {
          email: true,
          id: true,
          blockedUsers: true,
        },
      });
    } catch (err) {
      return null;
    }
  }
  generateRandomCode(length = 10): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@$%^!&*(){}[]><_+-=~`';
    let inviteCode = '';
    for (let i = 0; i < length; i++) {
      inviteCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return inviteCode;
  }
}
