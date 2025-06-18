export enum MessageType {
  "TEXT",
  "AUDIO",
  "INFO",
}
export interface MessaageAESKeyType {
  userId: string;
  messageId: string;
  aesKey: string;
}

export interface Attachment {
  name: string;
  src: string;
}

export interface Message {
  id: string;
  authorId: string;
  chatroomId: string;
  type: MessageType;
  content: string;

  attachments: Attachment[];
  aesKeys: MessaageAESKeyType[];
}
