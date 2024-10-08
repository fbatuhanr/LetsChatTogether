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
import { ActiveSelectionProps, ChatProps } from "../../types/Chat.types";
import useGeneralNotifications from "./useGeneralNotifications";

const useChat = (currentUserId: string, currentUsername: string) => {
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isUserSelectionInProgress, setIsUserSelectionInProgress] =
    useState(false);
  const [isMessageSending, setIsMessageSending] = useState(false);
  const [isChatDeletionInProgress, setIsChatDeletionInProgress] =
    useState(false);
  const [isMessageDeletionInProgress, setIsMessageDeletionInProgress] =
    useState(false);

  const axiosInstance = useAxios();

  const { fetchGeneralNotifications } = useGeneralNotifications(currentUserId);

  const socket = useMemo(
    () =>
      io(`${process.env.API_URL}`, { extraHeaders: { userid: currentUserId } }),
    [currentUserId]
  );

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const [activeSelection, setActiveSelection] = useState<ActiveSelectionProps>({
    chat: null,
    user: null,
  });

  const [chats, setChats] = useState<ChatProps[]>([]);
  const [messages, setMessages] = useState<MessageProps[]>([]);

  const [messageInput, setMessageInput] = useState('');

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserChats(currentUserId);

    socket.on("users", (users: string[]) => {
      // console.log("socket.on('users'): ", users);
      setOnlineUsers(users);
    });
    socket.on("message", (message: MessageProps) => {
      // console.log("socket.on('message'): ", message);
      setMessages((prev) => [...prev, message]);
    });
    socket.on("messageNotification", (notificationData) => {
      // console.log("socket.on('messageNotification'):", notificationData);
      fetchGeneralNotifications();
      setChats((prev) =>
        prev.map((chat) => {
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
      // console.log("socket.on('chatSelected')");
      fetchUserChats(currentUserId);
    });
    socket.on("chatDeleted", (data) => {
      // console.log("socket.on('chatDeleted'): ", data);
      const { chatId, deleteBy } = data;
      toast.warning(
        `${deleteBy} has cleared the entire chat history between you two!`,
        { autoClose: 4000, pauseOnHover: true }
      );
      setActiveSelection((prev) => {
        setChats((prevChats) =>
          prevChats.filter((chat) => chat._id !== chatId)
        );

        if (chatId !== prev.chat?._id) {
          return prev;
        }

        setMessages([]);
        setMessageInput('');
        socket.emit("chatClosed");

        return {
          chat: null,
          user: null,
        };
      });
    });
    socket.on("messageDeleted", (messageId: string) => {
      // console.log("socket.on('messageDeleted'): ", messageId);
      setActiveSelection((prev) => {
        toast.warning(`${prev.user?.username} has deleted a message!`, {
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
    scrollChatContainerToBottom();
  }, [messages]);

  const handleSelectUser = async (user: FriendProps) => {
    if (isUserSelectionInProgress) return;

    if (user._id === activeSelection.user?._id) {
      setActiveSelection({ chat: null, user: null });
      setMessages([]);
      setMessageInput('');
      socket.emit("chatClosed");
      return;
    }
    try {
      setIsUserSelectionInProgress(true);
      setIsLoadingChats(true);
      setIsLoadingMessages(true);

      const response = await axiosInstance.post("chat", {
        senderId: currentUserId,
        receiverId: user._id,
      });
      // console.log("Chat Created or Updated:", response.data);
      setActiveSelection({
        chat: response.data,
        user: user,
      });
      fetchUserChats(currentUserId);
      fetchUsersMessages(response.data._id, user._id);
      fetchGeneralNotifications();
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.selectUser;

      toast.error(errorMessage);
    } finally {
      setIsUserSelectionInProgress(false);
    }
  };
  const handleSendMessage = async () => {
    if (!messageInput || isMessageSending) return;
    try {
      if (!activeSelection?.chat || !activeSelection?.user) throw false;
      setIsMessageSending(true);

      const data = {
        chatId: activeSelection.chat._id,
        senderId: currentUserId,
        receiverId: activeSelection.user._id,
        text: messageInput,
      };
      const response = await axiosInstance.post("message", data);
      // console.log("Saved Sent Message:", response.data);
      setMessages((prev) => [...prev, response.data]);
      setMessageInput('');
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.sendMessage;

      toast.error(errorMessage);
      return false;
    } finally {
      setIsMessageSending(false);
    }
  };
  const handleDeleteChat = async () => {
    if (isChatDeletionInProgress) return;
    try {
      if (!activeSelection?.chat || !activeSelection?.user) throw false;
      setIsChatDeletionInProgress(true);

      const result = await Swal.fire({
        title: `Do you want to delete all conversations and chat with ${activeSelection.user?.username}?`,
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
              `chat/${activeSelection.chat?._id}`,
              {
                data: {
                  deleteBy: currentUsername,
                  receiverId: activeSelection.user?._id,
                },
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

        setActiveSelection({ chat: null, user: null });
        setChats((prev) => prev.filter((chat) => chat._id !== activeSelection.chat?._id));
        setMessages([]);
        setMessageInput('');

        socket.emit("chatClosed");
      }
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.deleteChat;

      Swal.fire("Error!", errorMessage, "error");
    } finally {
      setIsChatDeletionInProgress(false);
    }
  };
  const handleDeleteMessage = async (messageId: string) => {
    if (isMessageDeletionInProgress) return;
    try {
      if (!messageId || !activeSelection?.chat || !activeSelection?.user) throw false;

      setIsMessageDeletionInProgress(true);

      const response = await axiosInstance.delete(`message/${messageId}`, {
        data: {
          chatId: activeSelection.chat._id,
          receiverId: activeSelection.user._id,
        },
      });
      setMessages((prev) => prev.filter((message) => message._id !== messageId));

      toast.success(response.data.message);
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.deleteMessage;

      toast.error(errorMessage);
    } finally {
      setIsMessageDeletionInProgress(false);
    }
  };

  const fetchUsersMessages = async (chatId: string, selectedUserId: string) => {
    try {
      setIsLoadingMessages(true);
      const response = await axiosInstance.get(`message/${chatId}`);
      // console.log("Messages Between Selected Users:", response.data);
      const result = response.data.map((msg: MessageProps) => {
        const isSenderCurrentUser = msg.senderId === currentUserId;
        return {
          _id: msg._id,
          text: msg.text,
          date: msg.createdAt,
          senderId: isSenderCurrentUser ? currentUserId : selectedUserId,
          receiverId: isSenderCurrentUser ? selectedUserId : currentUserId,
        };
      });

      setMessages(result);
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.fetchMessages;

      toast.error(errorMessage);
    } finally {
      setIsLoadingMessages(false);
    }
  };
  const fetchUserChats = async (userId: string) => {
    try {
      if (!userId) throw false;
      setIsLoadingChats(true);

      const response = await axiosInstance.get(`chat/${userId}`);
      // console.log("User's Conversations:", response.data);
      setChats(response.data);
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.fetchConversations;

      toast.error(errorMessage);
    } finally {
      setIsLoadingChats(false);
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
    isLoadingChats,
    isLoadingMessages,
    isUserSelectionInProgress,
    isMessageSending,
    isChatDeletionInProgress,
    isMessageDeletionInProgress,

    chatContainerRef,

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
  };
};

export default useChat;
