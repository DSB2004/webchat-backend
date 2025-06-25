import { MessageType, AttachmentType, ChatroomType } from "@webchat-backend/db";

export interface MessaageAESKeyType {
  userId: string;
  messageId: string;
  aesKey: string;
}

export interface Attachment {
  name: string;
  type: AttachmentType;
  src: string;
}

export interface Message {
  id: string;
  authorId: string;
  chatroomId: string;
  type: MessageType;
  content: string;
  chatroomType: ChatroomType;
  attachments: Attachment[];
  aesKeys: MessaageAESKeyType[];
}
export interface TokenType {
  type: "AUTH_TOKEN" | "REFRESH_TOKEN";
  email: string;
  id: string;
}
