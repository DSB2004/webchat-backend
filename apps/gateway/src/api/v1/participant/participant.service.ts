import { Injectable } from '@nestjs/common';
import { ParticipantGateway } from 'src/sockets/chatroom/participant/participant.gateway';
@Injectable()
export class ParticipantService {
  constructor(private readonly participantGateway: ParticipantGateway) {}

  async notifyAddParticipant({
    message,
    chatroomId,
  }: {
    message: string;
    chatroomId: string;
  }) {
    try {
      await this.participantGateway.notifyAddPariticipant({
        message,
        chatroomId,
      });
      return { status: 200, message: 'Update sent via websocket' };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
  async notifyRemoveParticipant({
    message,
    chatroomId,
  }: {
    message: string;
    chatroomId: string;
  }) {
    try {
      await this.participantGateway.notifyRemovePariticipant({
        message,
        chatroomId,
      });
      return { status: 200, message: 'Update sent via websocket' };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
  async notifyLeftParticipant({
    message,
    chatroomId,
  }: {
    message: string;
    chatroomId: string;
  }) {
    try {
      await this.participantGateway.notifyLeftPariticipant({
        message,
        chatroomId,
      });
      return { status: 200, message: 'Update sent via websocket' };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
  async notifyJoinParticipant({
    message,
    chatroomId,
  }: {
    message: string;
    chatroomId: string;
  }) {
    try {
      await this.participantGateway.notifyJoinPariticipant({
        message,
        chatroomId,
      });
      return { status: 200, message: 'Update sent via websocket' };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }

  async notifyChatroomCreated({
    message,
    chatroomId,
  }: {
    message: string;
    chatroomId: string;
  }) {
    try {
      await this.participantGateway.notifyChatroomCreate({
        message,
        chatroomId,
      });
      return { status: 200, message: 'Update sent via websocket' };
    } catch (err) {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
}
