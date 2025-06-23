import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UtilsService } from 'src/utils/utils.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly util: UtilsService) {}
  async handleConnection(client: Socket) {
    const token = client.handshake.headers?.auth;
    if (!token || typeof token !== 'string') {
      client.emit('error', {
        code: 403,
        message: 'Unauthorized or missing device ID',
      });
      client.disconnect();
      return;
    }

    const user = await this.util.getUserfromDB({ accessToken: token });

    if (!user) {
      client.emit('error', { code: 403, message: 'Invalid user' });
      client.disconnect();
      return;
    }
    const { id } = user;
    const connected = await this.util.connectUser({
      userId: id,
      socketId: client.id,
    });
    if (!connected) {
      client.emit('error', {
        code: 403,
        message: 'User is already connected on another socket',
      });
      client.disconnect();
      return;
    }
    console.log(`Client connected: ${id}: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    await this.util.disconnectUser({ socketId: client.id });
  }
}
