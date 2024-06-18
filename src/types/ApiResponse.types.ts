import { Message } from "@/models/message.models";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessage: boolean;
  messages?: Array<Message>;
}
