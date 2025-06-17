import { Injectable } from '@nestjs/common';
import { db } from '@webchat-backend/db';
import { AuthService } from 'src/auth/auth.service';
import { SharedService } from 'src/shared/shared.service';
@Injectable()
export class UserService {
  constructor(private readonly sharedService: SharedService) {}
  async create({
    email,
    status,
    profilePic,
    description,
  }: {
    email: string;
    status?: string;
    profilePic?: string;
    description?: string;
  }) {
    try {
      const username = email.split('@')[0];
      const user = await this.sharedService.existUser({ email });
      if (user) return { status: 400, message: 'User already exist' };
      const auth = await this.sharedService.existAuth({ email });
      if (!auth || !auth.isVerified)
        return { status: 403, message: 'User not verified' };
      await db.user.create({
        data: {
          email,
          username,
          profilePic,
          description,
          status,
          auth: {
            connect: {
              id: auth.id,
            },
          },
        },
      });
      return { status: 200, message: 'User created successfully' };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    } finally {
    }
  }

  async update({
    email,
    username,
    status,
    profilePic,
    description,
  }: {
    email: string;
    username?: string;
    status?: string;
    profilePic?: string;
    description?: string;
  }) {
    try {
      const user = await this.sharedService.existUser({ email });

      const updateData: Record<string, any> = {};
      if (username) updateData.username = username;
      if (status) updateData.status = status;
      if (profilePic) updateData.profilePic = profilePic;
      if (description) updateData.description = description;

      if (!user) return { status: 400, message: "User doesn't exist" };
      const auth = await this.sharedService.existAuth({ email });
      if (!auth || !auth.isVerified)
        return { status: 403, message: 'User not verified' };
      await db.user.update({
        data: {
          ...updateData,
          auth: {
            connect: {
              id: auth.id,
            },
          },
        },
        where: { email },
      });

      return { status: 200, message: 'User updated successfully' };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    } finally {
    }
  }

  async list({ email }: { email: string }) {
    try {
      const user = await db.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          status: true,
          email: true,
          username: true,
          description: true,
          profilePic: true,
        },
      });

      return user == null
        ? { status: 404, message: 'User not found' }
        : { status: 200, message: 'User found', user };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
}
