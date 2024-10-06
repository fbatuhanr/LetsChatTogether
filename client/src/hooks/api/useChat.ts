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
import useGeneralNotifications from "./useGeneralNotifications";

const useChat = (currentUserId: string, currentUsername: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const axiosInstance = useAxios();

  const { fetchGeneralNotifications } = useGeneralNotifications(currentUserId);

  const socket = useMemo(
    () =>
      io(`${process.env.API_URL}`, { extraHeaders: { userid: currentUserId } }),
    [currentUserId]
  );

  const [chat, setChat] = useState<ConversationProps | null>(null);
  const [targetUser, setTargetUser] = useState<FriendProps | null>(null);

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [conversations, setConversations] = useState<ConversationProps[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserConversations(currentUserId);

    socket.on("users", (users: string[]) => {
      console.log("socket.on('users'): ", users);
      setOnlineUsers(users);
    });
    socket.on("message", (message: MessageProps) => {
      console.log("socket.on('message'): ", message);
      setMessages((prev) => [...prev, message]);
    });
    socket.on("messageNotification", (notificationData) => {
      console.log("socket.on('messageNotification'):", notificationData);
      fetchGeneralNotifications();
      setConversations((prevChats) =>
        prevChats.map((chat) => {
          if (
            chat.members.includes(currentUserId) &&
            chat.members.includes(notificationData.senderId)
          ) {
            return {
              ...chat,
              unreadMessagesCount: notificationData.unreadMessagesCount,
            };
          }
          return chat;
        })
      );
    });
    socket.on("chatSelected", () => {
      console.log("socket.on('chatSelected')");
      fetchUserConversations(currentUserId);
    });
    socket.on("chatDeleted", (data) => {
      console.log("socket.on('chatDeleted'): ", data);

      const { chatId, deleteBy } = data;

      toast.warning(
        `${deleteBy} has cleared the entire chat history between you two!`,
        { autoClose: 4000, pauseOnHover: true }
      );

      setChat((prev) => {
        setConversations((prev) => prev.filter((chat) => chat._id !== chatId));
        if (chatId !== prev?._id) {
          return prev;
        }
        setMessages([]);
        setTargetUser(null);
        setMessageInput("");
        socket.emit("chatClosed");
        return null;
      });
    });
    socket.on("messageDeleted", (messageId: string) => {
      console.log("socket.on('messageDeleted'): ", messageId);

      setTargetUser((prev) => {
        toast.warning(`${prev?.username} has deleted a message!`, {
          autoClose: 3000,
          pauseOnHover: true,
        });

        return prev;
      });
      setMessages((prev) =>
        prev.filter((message) => message._id !== messageId)
      );
    });

    return () => {
      socket.off("users");
      socket.off("message");
      socket.off("messageNotification");
      socket.off("chatSelected");
      socket.off("chatDeleted");
      socket.off("messageDeleted");

      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToTop();
    scrollChatContainerToBottom();
  }, [messages]);

  const handleSelectUser = async (user: FriendProps) => {
    if (user._id === targetUser?._id) {
      setChat(null);
      setTargetUser(null);
      setMessages([]);
      setMessageInput("");
      socket.emit("chatClosed");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("chat", {
        senderId: currentUserId,
        receiverId: user._id,
      });
      console.log("Chat Created or Updated:", response.data);

      setChat(response.data);
      setTargetUser(user);
      fetchUserConversations(currentUserId);
      fetchUsersMessages(response.data._id, user._id);
      fetchGeneralNotifications();
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
    if (!messageInput) return;

    try {
      if (!chat || !targetUser) throw false;

      const data = {
        chatId: chat._id,
        senderId: currentUserId,
        receiverId: targetUser._id,
        text: messageInput,
      };
      const response = await axiosInstance.post("message", data);
      console.log("Saved Sent Message:", response.data);
      setMessages((prev) => [...prev, response.data]);
      setMessageInput("");
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
      const response = await axiosInstance.get(`message/${chatId}`);
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
      if (!userId) throw false;

      const response = await axiosInstance.get(`chat/${userId}`);
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
    try {
      if (!chat || !targetUser) throw false;

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
            const response = await axiosInstance.delete(`chat/${chat._id}`, {
              data: {
                deleteBy: currentUsername,
                receiverId: targetUser._id,
              },
            });

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

        setChat(null);
        setTargetUser(null);
        setConversations((prev) =>
          prev.filter((conv) => conv._id !== chat._id)
        );
        setMessages([]);
        setMessageInput("");

        socket.emit("chatClosed");
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
    try {
      if (!messageId || !chat || !targetUser) throw false;

      const response = await axiosInstance.delete(`message/${messageId}`, {
        data: {
          chatId: chat._id,
          receiverId: targetUser._id,
        },
      });
      setMessages((prev) =>
        prev.filter((message) => message._id !== messageId)
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
