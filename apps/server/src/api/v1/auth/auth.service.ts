import { Injectable } from '@nestjs/common';
import { db } from '@webchat-backend/db';
import { redis } from '@webchat-backend/redis';
import { VerifyJWT, CreateJWT } from '@webchat-backend/jwt';
import { ComparePassword, HashPassword } from '@webchat-backend/hash';
import { TokenType, OTPSessionType } from 'src/app.types';
import { UtilService } from 'src/util/util.service';
@Injectable()
export class AuthService {
  constructor(private readonly util: UtilService) {}
  private async create({ email, password, loginType }) {
    try {
      const hashedPassword = await HashPassword(password);
      const auth = await db.auth.create({
        data: {
          email,
          password: hashedPassword,
          isVerified: false,
          loginType,
        },
      });
      return auth;
    } catch (err) {
      return null;
    }
  }

  private async sendOTP({ email }: { email: string }) {
    try {
      const otp = 1234;
      await redis.set('otp-session-' + email, JSON.stringify({ email, otp }));
      if (process.env.NODE_ENV === 'development')
        console.log(`[OTP] ${email}:${otp}`);
      return true;
    } catch (err) {
      return false;
    }
  }

  private async verifyOTP({ otp, email }: { email: string; otp: string }) {
    const session = JSON.parse(
      (await redis.get('otp-session-' + email)) || '{}',
    ) as OTPSessionType | null;
    if (session === null) return { status: false, message: 'Session expired' };
    const { otp: _otp } = session;
    if (_otp != otp) return { status: false, message: "OTP didn't matched" };
    return { status: true, message: 'OTP verified' };
  }

  private async verifyUser({ otp, email }: { otp: string; email: string }) {
    try {
      const { status, message } = await this.verifyOTP({ otp, email });
      if (!status) return { status: 400, message };
      const user = await this.util.existAuth({ email });
      if (user == null) return { status: 400, message: "User doesn't exist" };
      await db.auth.update({
        data: {
          isVerified: true,
        },
        where: {
          email,
        },
      });
      return { status: 200, message: 'User verified successfully' };
    } catch (err) {
      return { status: 500, message: 'User verified successfully' };
    } finally {
    }
  }
  // main services

  async signup({ email, password }: { email: string; password: string }) {
    try {
      const user = await this.util.existAuth({ email });
      if (user) return { status: 400, message: 'User already exist' };
      const auth = await this.create({ email, password, loginType: 'EMAIL' });
      if (!auth) return { status: 500, message: 'Internal Server Error' };
      await this.sendOTP({ email });
      return { status: 200, message: 'Please verify your Email' };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    } finally {
    }
  }
  async login({ email, password }: { email: string; password: string }) {
    try {
      const user = await this.util.existAuth({ email });
      if (!user) return { status: 400, message: 'User not found' };
      const {
        id,
        email: dbEmail,
        password: dbPassword,
        isVerified,
        loginType,
      } = user;

      if (loginType !== 'EMAIL')
        return {
          status: 400,
          message:
            'Accounted registered as ' + loginType.toUpperCase() + ' account',
        };
      const verify = await ComparePassword(password, dbPassword);
      if (!verify) return { status: 400, message: 'Invalid Credential' };

      if (!isVerified) {
        await this.sendOTP({ email });
        return { status: 403, message: 'Please verify your email' };
      }
      const accessToken = await CreateJWT({
        payload: {
          type: 'ACCESS_TOKEN',
          email: dbEmail,
          id,
        },
        expireIn: '1d',
      });
      const refreshToken = await CreateJWT({
        payload: {
          type: 'REFRESH_TOKEN',
          email: dbEmail,
          id,
        },
        expireIn: '7d',
      });
      const userExist = (await this.util.existUser({ email })) != null;
      return {
        status: 200,
        message: 'You have successfully logged in',
        accessToken,
        refreshToken,
        userExist,
      };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    } finally {
    }
  }

  async verify({ otp, email }: { otp: string; email: string }) {
    const auth = await this.util.existAuth({ email });
    if (!auth || auth == null)
      return { status: 400, message: 'No account found' };
    const { status, message } = await this.verifyUser({ otp, email });
    if (!status) return { status, message };
    const accessToken = await CreateJWT({
      payload: {
        type: 'ACCESS_TOKEN',
        email: email,
        id: auth.id,
      },
      expireIn: '1d',
    });
    const refreshToken = await CreateJWT({
      payload: {
        type: 'REFRESH_TOKEN',
        email: email,
        id: auth.id,
      },
      expireIn: '7d',
    });
    const userExist = (await this.util.existUser({ email })) != null;
    return {
      status: 200,
      message: 'Your email has been verified',
      accessToken,
      refreshToken,
      userExist,
    };
  }
  async refresh({ _refreshToken }: { _refreshToken: string }) {
    try {
      const token = await VerifyJWT<TokenType>(_refreshToken);

      if (!token || token == null)
        return { status: 400, message: 'Token has expired' };
      const { email, type, id } = token;

      if (type !== 'REFRESH_TOKEN')
        return { status: 403, message: 'Invalid Token' };

      const accessToken = await CreateJWT({
        payload: {
          type: 'ACCESS_TOKEN',
          email: email,
          id,
        },
        expireIn: '1d',
      });
      const refreshToken = await CreateJWT({
        payload: {
          type: 'REFRESH_TOKEN',
          email,
          id,
        },
        expireIn: '7d',
      });
      return {
        status: 200,
        message: 'Token refreshed',
        accessToken,
        refreshToken,
      };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    } finally {
    }
  }
  async forgetPassword({ email }: { email: string }) {
    try {
      const user = await this.util.existAuth({ email });
      if (!user) return { status: 400, message: 'User not found' };
      await this.sendOTP({ email });
      return {
        status: 200,
        message: 'Verification code has been sent to your email',
      };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }

  async resetPassword({
    otp,
    email,
    password,
  }: {
    otp: string;
    email: string;
    password: string;
  }) {
    try {
      const { status, message } = await this.verifyOTP({ otp, email });
      if (!status) return { status: 400, message };

      const _new_password = await HashPassword(password);
      await db.auth.update({
        data: { password: _new_password },
        where: {
          email,
        },
      });
      return {
        status: 200,
        message: 'Password updated successfully',
      };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
}
