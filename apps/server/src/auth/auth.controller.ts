import { Controller, Get, Post, Req, Body } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  async login(@Body() body: { email: string; password: string }) {
    if (!body) throw new HttpException('Body is required', 400);
    const { email, password } = body;
    if (!email || !password)
      throw new HttpException('email, password required', 400);
    const { status, message, ...rest } = await this.authService.login({
      email,
      password,
    });

    if (status !== 200) {
      throw new HttpException(message, status);
    }
    return { status, message, ...rest };
  }

  @Post('/signup')
  async signup(@Body() body: { email: string; password: string }) {
    if (!body) throw new HttpException('Body is required', 400);
    const { email, password } = body;
    if (!email || !password)
      throw new HttpException('email, password required', 400);
    const { status, message } = await this.authService.signup({
      email,
      password,
    });

    if (status !== 200) {
      throw new HttpException(message, status);
    }
    return { status, message };
  }

  @Post('/otp/verify')
  async verifyOTP(@Body() body: { email: string; otp: string }) {
    if (!body) throw new HttpException('Body is required', 400);
    const { email, otp } = body;
    if (!email || !otp) throw new HttpException('email, otp is required', 400);
    const { status, message, ...rest } = await this.authService.verify({
      email,
      otp,
    });

    if (status !== 200) {
      throw new HttpException(message, status);
    }
    return { status, message, ...rest };
  }

  @Post('/password/forget')
  async forgetPassword(@Body() body: { email: string }) {
    if (!body) throw new HttpException('Body is required', 400);
    const { email } = body;
    if (!email) throw new HttpException('email is required', 400);
    const { status, message, ...rest } = await this.authService.forgetPassword({
      email,
    });

    if (status !== 200) {
      throw new HttpException(message, status);
    }
    return { status, message, ...rest };
  }

  @Post('/password/reset')
  async resetPassword(
    @Body() body: { email: string; password: string; otp: string },
  ) {
    if (!body) throw new HttpException('Body is required', 400);
    const { email, password, otp } = body;
    if (!email) throw new HttpException('email, password, otp required', 400);
    const { status, message, ...rest } = await this.authService.resetPassword({
      email,
      password,
      otp,
    });

    if (status !== 200) {
      throw new HttpException(message, status);
    }
    return { status, message, ...rest };
  }

  @Post('/token/refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    if (!body) throw new HttpException('Body is required', 400);
    const { refreshToken } = body;
    if (!refreshToken) throw new HttpException('refreshToken required', 400);
    const { status, message, ...rest } = await this.authService.refresh({
      _refreshToken: refreshToken,
    });

    if (status !== 200) {
      throw new HttpException(message, status);
    }
    return { status, message, ...rest };
  }
}
