export interface MessageProps {
  _id: string;

  text: string;
  date: Date | string | null;

  senderId: string;
  receiverId: string | null;

  createdAt?: Date;

  isRead?: boolean;
}

export interface MessageChatProps {
  _id: string;
  
  senderId: string;

  text: string;
  date: Date | string | null;

  senderUsername: string | null | undefined;
  senderProfilePhoto: string | null | undefined;
}
