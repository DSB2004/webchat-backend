import { Injectable } from '@nestjs/common';
import { db } from '@webchat-backend/db';
@Injectable()
export class AuthService {
  async login({ email, password }: { email: string; password: string }) {}
}
