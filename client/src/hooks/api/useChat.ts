// src/hooks/useChat.ts
import { useEffect, useMemo, useRef, useState } from 'react';
import io from 'socket.io-client';
import useAxios from '../useAxios';
import { FriendProps } from '../../types/User.types';
import { MessageProps } from '../../types/Message.types';
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';

const useChat = (currentUserId: string, currentUsername: string) => {

    const axiosInstance = useAxios();

    const socket = useMemo(
        () => io(`${process.env.API_URL}`, { extraHeaders: { userid: currentUserId } }),
        [currentUserId]
    );

    const [chat, setChat] = useState<string | null>(null);

    const [onlineUsers, setOnlineUsers] = useState<Array<string> | null>(null);
    const [targetUser, setTargetUser] = useState<FriendProps | null>(null);

    const [messages, setMessages] = useState<Array<MessageProps>>([]);
    const [messageInput, setMessageInput] = useState<string>("");
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        /*const activeChats = async () => {
            const response = await axiosInstance.get(`${process.env.CHAT_API_URL}/${currentUserId}`);
            console.log(response.data);
        };
        activeChats();*/

        socket.on('users', (users: any) => {
            console.log(users)
            setOnlineUsers(users)
        })
        socket.on('chatDeleted', (data: any) => {

            console.log("CHAT DELETED!")

            const { chatId, deleteBy } = data

            if (currentUsername !== deleteBy) {
                toast.warning(`${deleteBy} has cleared the entire chat history between you two!`, {
                    autoClose: 4000,
                    pauseOnHover: true
                });
            }

            setChat((prev) => {

                if (chatId !== prev) {
                    return prev;
                }
    
                setMessages([]);
                setTargetUser(null);
                setMessageInput("");
    
                return null;
            });

        })

        socket.on('messageDeleted', (messageId: string) => {
            console.log("MESSAGE DELETED!")

            setMessages((prev) => prev.filter(message => message._id !== messageId));
        })

        return () => {
            socket.off('users')
            socket.off('chatDeleted')
            socket.off('messageDeleted')

            socket.disconnect();
        }
    }, []);

    useEffect(() => {
        socket.on('message', (message: any) => {
            console.log(message);
            setMessages((prev) => [...prev, message]);
        });

        scrollChatContainerToBottom();

        return () => {
            socket.off('message');
        };
    }, [messages]);

    const handleSendMessage = async () => {

        if (!messageInput || !targetUser) return;

        const data = {
            text: messageInput,
            senderId:
                currentUserId,
            chatId: chat
        }
        setMessageInput("");

        const response = await axiosInstance.post(`${process.env.MESSAGE_API_URL}`, data);
        console.log(response.data);

        const { _id, text, createdAt } = response.data
        const messageData: MessageProps = {
            _id,
            text,
            date: createdAt,
            senderId: currentUserId,
            receiverId: targetUser?._id
        };

        socket.emit('sendMessage', messageData);
        setMessages((prev) => [...prev, messageData]);
    }

    const handleSelectUser = async (user: FriendProps) => {

        if(user._id === targetUser?._id){
            setTargetUser(null)
            return
        }
        
        setTargetUser(user);

        const data = { firstId: currentUserId, secondId: user._id };
        const response = await axiosInstance.post(`${process.env.CHAT_API_URL}`, data);
        console.log(response.data);

        fetchUsersConversations(response.data._id, user._id);
        setChat(response.data._id);
    };

    const fetchUsersConversations = async (chatId: string, selectedUserId: string) => {

        const response = await axiosInstance.get(`${process.env.MESSAGE_API_URL}/${chatId}`);
        const conversation = response.data.map((msg: any) => {
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
    };

    const scrollChatContainerToBottom = () => {
        if (!chatContainerRef.current) return;

        chatContainerRef.current.scroll({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth',
        });
    };

    const handleDeleteChat = async () => {

        if (!chat) return

        try {
            const result = await Swal.fire({
                title: `Do you want to delete all conversations and chat with ${targetUser?.username}?`,
                text: 'This action cannot be undone!',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                showLoaderOnConfirm: true, // Show loader
                preConfirm: async () => {
                    // Send API request
                    try {
                        const response = await axiosInstance.delete(`${process.env.CHAT_API_URL}/${chat}`, {
                            data: { deleteBy: currentUsername }
                        });
                        if (response.status !== 200) {
                            throw new Error('An error occurred during the delete operation.');
                        }
                    } catch (error: any) {
                        Swal.showValidationMessage(error.message || 'An error occurred during the delete operation.');
                        return false;
                    }
                },
                allowOutsideClick: () => !Swal.isLoading() // Prevent closing popup by clicking outside while loading
            });

            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Chat has been deleted successfully.',
                    'success'
                )
            }
        } catch (error: any) {
            Swal.fire(
                'Error!',
                error.message || 'An error occurred during the delete operation.',
                'error'
            );
        }
    }

    const handleDeleteMessage = async (messageId: string) => {

        if (!messageId) return

        try {
            const response = await axiosInstance.delete(`${process.env.MESSAGE_API_URL}/${messageId}`);
            if (response.status !== 200) {
                throw new Error('An error occurred during the delete operation.');
            }
        } catch (error: any) {

        }
    }

    return {
        chat,
        chatContainerRef,

        onlineUsers,
        targetUser,

        messages,

        messageInput,
        setMessageInput,

        handleSelectUser,
        handleSendMessage,

        handleDeleteChat,
        handleDeleteMessage
    };
};

export default useChat;
