/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import io from "socket.io-client";
import useAxios from "../useAxios";
import { FriendProps } from "../../types/User.types";
import { MessageProps } from "../../types/Message.types";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { isApiError } from "../../helper/apiHelpers";
import { errorMessages } from "../../constants/errorMessages";
import { ConversationProps } from "../../types/Chat.types";

const useChat = (currentUserId: string, currentUsername: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const axiosInstance = useAxios();

  const socket = useMemo(
    () =>
      io(`${process.env.API_URL}`, { extraHeaders: { userid: currentUserId } }),
    [currentUserId]
  );
  
  const [chat, setChat] = useState<ConversationProps | null>(null);

  const [onlineUsers, setOnlineUsers] = useState<string[] | null>(null);
  const [targetUser, setTargetUser] = useState<FriendProps | null>(null);

  const [conversations, setConversations] = useState<ConversationProps[]>([]);

  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserConversations(currentUserId);

    socket.on("users", (users: string[]) => {
      console.log(users);
      setOnlineUsers(users);
    });
    socket.on("chatDeleted", (data) => {
      console.log("CHAT DELETED!");

      const { chatId, deleteBy } = data;

      if (currentUsername !== deleteBy) {
        toast.warning(
          `${deleteBy} has cleared the entire chat history between you two!`,
          {
            autoClose: 4000,
            pauseOnHover: true,
          }
        );
      }

      setChat((prev) => {
        if (chatId !== prev?._id) {
          return prev;
        }

        setMessages([]);
        setTargetUser(null);
        setMessageInput("");

        return null;
      });
    });

    socket.on("messageDeleted", (messageId: string) => {
      console.log("MESSAGE DELETED!");

      setMessages((prev) =>
        prev.filter((message) => message._id !== messageId)
      );
    });

    return () => {
      socket.off("users");
      socket.off("chatDeleted");
      socket.off("messageDeleted");

      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("message", (message: MessageProps) => {
      console.log(message);
      setMessages((prev) => [...prev, message]);
    });

    scrollChatContainerToBottom();

    return () => {
      socket.off("message");
    };
  }, [messages]);

  const handleSelectUser = async (user: FriendProps) => {
    if (user._id === targetUser?._id) {
      setTargetUser(null);
      setChat(null);
      return;
    }
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        `${process.env.CHAT_API_URL}`,
        { firstId: currentUserId, secondId: user._id }
      );
      console.log("Chat Created or Updated:", response.data);
      setTargetUser(user);
      fetchUserConversations(currentUserId);
      fetchUsersMessages(response.data._id, user._id);
      setChat(response.data);
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.selectUser;

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSendMessage = async () => {
    if (!messageInput || !targetUser) return;

    const data = {
      text: messageInput,
      senderId: currentUserId,
      chatId: chat?._id,
    };
    try {
      const response = await axiosInstance.post(
        `${process.env.MESSAGE_API_URL}`,
        data
      );
      setMessageInput("");
      console.log("Saved Sent Message:", response.data);

      const { _id, text, createdAt } = response.data;
      const messageData: MessageProps = {
        _id,
        text,
        date: createdAt,
        senderId: currentUserId,
        receiverId: targetUser?._id,
      };

      socket.emit("sendMessage", messageData);
      setMessages((prev) => [...prev, messageData]);
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.sendMessage;

      toast.error(errorMessage);
      return false;
    }
  };

  const fetchUsersMessages = async (chatId: string, selectedUserId: string) => {
    try {
      const response = await axiosInstance.get(
        `${process.env.MESSAGE_API_URL}/${chatId}`
      );
      console.log("Messages Between Selected Users:", response.data);
      const conversation = response.data.map((msg: MessageProps) => {
        const isSenderCurrentUser = msg.senderId === currentUserId;
        return {
          _id: msg._id,
          text: msg.text,
          date: msg.createdAt,
          senderId: isSenderCurrentUser ? currentUserId : selectedUserId,
          receiverId: isSenderCurrentUser ? selectedUserId : currentUserId,
        };
      });

      setMessages(conversation);
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.fetchMessages;

      toast.error(errorMessage);
    }
  };
  const fetchUserConversations = async (userId: string) => {
    try {
      const response = await axiosInstance.get(
        `${process.env.CHAT_API_URL}/${userId}`
      );
      console.log("User's Conversations:", response.data);
      setConversations(response.data);
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.fetchConversations;

      toast.error(errorMessage);
    }
  };

  const handleDeleteChat = async () => {
    if (!chat) return;

    try {
      const result = await Swal.fire({
        title: `Do you want to delete all conversations and chat with ${targetUser?.username}?`,
        text: "This action cannot be undone!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            const response = await axiosInstance.delete(
              `${process.env.CHAT_API_URL}/${chat._id}`,
              {
                data: { deleteBy: currentUsername },
              }
            );

            return response.data.message;
          } catch (error: unknown) {
            const errorMessage =
              isApiError(error) && error.response?.data?.message
                ? error.response.data.message
                : errorMessages.deleteChat;

            Swal.showValidationMessage(errorMessage);
            return false;
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });

      if (result.isConfirmed) {
        const successMessage = result.value;
        Swal.fire("Deleted!", successMessage, "success");
        fetchUserConversations(currentUserId);
      }
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.deleteChat;

      Swal.fire("Error!", errorMessage, "error");
    }
  };
  const handleDeleteMessage = async (messageId: string) => {
    if (!messageId) return;

    try {
      const response = await axiosInstance.delete(
        `${process.env.MESSAGE_API_URL}/${messageId}`
      );

      toast.success(response.data.message);
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.deleteMessage;

      toast.error(errorMessage);
    }
  };

  const scrollChatContainerToBottom = () => {
    if (!chatContainerRef.current) return;

    chatContainerRef.current.scroll({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  return {
    isLoading,

    chat,
    chatContainerRef,

    onlineUsers,
    targetUser,

    conversations,
    messages,

    messageInput,
    setMessageInput,

    handleSelectUser,
    handleSendMessage,

    handleDeleteChat,
    handleDeleteMessage,
  };
};

export default useChat;
