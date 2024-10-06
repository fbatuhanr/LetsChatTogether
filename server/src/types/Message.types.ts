import mongoose from "mongoose";

export interface CreateMessageProps {
  chatId: string;
  senderId: string;
  text: string;
  isRead?: boolean;
}

export interface MessageProps {
  _id: string;
  
  text: string;
  date: Date | null;

  senderId: string;
  receiverId: string | null;

  createdAt?: Date;

  isRead?: boolean;
}