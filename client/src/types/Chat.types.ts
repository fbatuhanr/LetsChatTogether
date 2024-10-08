import { FriendProps } from "./User.types";

export interface ChatProps {
    _id: string;
    members: string[];
    unreadMessagesCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface ActiveSelectionProps {
  chat: ChatProps | null;
  user: FriendProps | null;
}