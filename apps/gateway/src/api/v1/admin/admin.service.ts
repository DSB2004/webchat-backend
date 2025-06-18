import { Injectable } from '@nestjs/common';
import { AdminGateway } from 'src/sockets/chatroom/admin/admin.gateway';
@Injectable()
export class AdminService {
  constructor(private readonly adminGateway: AdminGateway) {}

  async notifyAddAdmin({
    message,
    chatroomId,
  }: {
    message: string;
    chatroomId: string;
  }) {
    try {
      await this.adminGateway.notifyAddAdmin({
        message,
        chatroomId,
      });
      return { status: 200, message: 'Update sent via websocket' };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
  async notifyRemoveAdmin({
    message,
    chatroomId,
  }: {
    message: string;
    chatroomId: string;
  }) {
    try {
      await this.adminGateway.notifyRemoveAdmin({
        message,
        chatroomId,
      });
      return { status: 200, message: 'Update sent via websocket' };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
}
