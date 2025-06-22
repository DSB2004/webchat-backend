import { StatusType } from '@webchat-backend/db';
export enum KAFKA_EVENTS {
  MESSAGE_CREATE = 'message.create',
  MESSAGE_UPDATE = 'message.update',
  MESSAGE_DELETE = 'message.delete',
  MESSAGE_STATUS = 'message.status',
  MESSAGE_PINNED = 'message.pinned',
  MESSAGE_STARRED = 'message.starred',
  MESSAGE_REACTION = 'message.reaction',
}
export enum PUB_SUB_EVENT {
  REGISTER_EVENT = 'register.event',
  EXECUTE = 'execute.event',
}

export interface EventParams {
  userId: string;
  messageId: string;
  chatroomId: string;
}

export interface ConsumerMessage<T> {
  event: KAFKA_EVENTS;
  data: T;
  userId: string;
}

export interface StatusParams extends EventParams {
  status: StatusType;
}
export interface ReactionParams extends EventParams {
  label: string;
  reaction: string;
}
