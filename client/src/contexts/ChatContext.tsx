/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect } from "react";
import useFriendship from "../hooks/api/useFriendship";
import useChat from "../hooks/api/useChat";
import { FriendProps } from "../types/User.types";
import { ActiveSelectionProps, ChatProps } from "../types/Chat.types";
import { MessageProps } from "../types/Message.types";

interface ChatProviderProps {
  currentUserId: string;
  currentUsername: string;
  children: React.ReactNode;
}

interface ChatContextProps {
  currentUserId: string;

  friends: FriendProps[];

  onlineUsers: string[];
  activeSelection: ActiveSelectionProps;

  chats: ChatProps[];
  messages: MessageProps[];

  friendsCount: number;
  chatsCount: number;

  messageInput: string;
  setMessageInput: (input: string) => void;

  handleSelectUser: (user: FriendProps) => void;
  handleSendMessage: () => void;
  handleDeleteChat: () => void;
  handleDeleteMessage: (messageId: string) => void;

  chatContainerRef: React.RefObject<HTMLDivElement>;

  isLoadingFriends: boolean;
  
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  isUserSelectionInProgress: boolean;
  isMessageSending: boolean;
  isChatDeletionInProgress: boolean;
  isMessageDeletionInProgress: boolean;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);
export const ChatProvider: React.FC<ChatProviderProps> = ({
  currentUserId,
  currentUsername,
  children,
}) => {
  const {
    onlineUsers,

    activeSelection,

    chats,
    messages,
    messageInput,
    setMessageInput,

    handleSelectUser,
    handleSendMessage,
    handleDeleteChat,
    handleDeleteMessage,

    chatContainerRef,

    isLoadingChats,
    isLoadingMessages,
    isUserSelectionInProgress,
    isMessageSending,
    isChatDeletionInProgress,
    isMessageDeletionInProgress,
  } = useChat(currentUserId, currentUsername);
  const { friends, isLoadingFriends, getFriends } = useFriendship(currentUserId);

  useEffect(() => {
    getFriends(true);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        currentUserId,

        friends,
        friendsCount: friends.length - 1,

        onlineUsers,
        activeSelection,

        chats,
        chatsCount: chats.length,

        messages,

        messageInput,
        setMessageInput,

        handleSelectUser,
        handleSendMessage,
        handleDeleteChat,
        handleDeleteMessage,

        chatContainerRef,

        isLoadingFriends,

        isLoadingChats,
        isLoadingMessages,
        isUserSelectionInProgress,
        isMessageSending,
        isChatDeletionInProgress,
        isMessageDeletionInProgress,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
