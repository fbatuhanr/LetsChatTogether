import { useEffect, useMemo, useRef, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'

import io from 'socket.io-client'
import { IoIosSend } from 'react-icons/io'
import useAxios from '../hooks/useAxios'
import { useDecodedToken } from '../hooks/useDecodedToken'

import cosmicButterfly from "../assets/background/cosmic-butterfly.png"
import cosmicButterflyRight from "../assets/background/cosmic-butterfly-right.png"
import useFriendship from '../hooks/api/useFriendship'
import { IFriend } from '../types/User'
import Button from '../components/general/clickable/Button'
import { Link } from 'react-router-dom'

interface IMessage {
  text: string,
  date: Date | null,

  senderId: string,
  receiverId: string | null
}

const Chat = () => {

  const axiosInstance = useAxios()
  const decodedToken = useDecodedToken()

  const currentUserId = decodedToken.userId

  const socket = useMemo(() => io(`${process.env.API_URL}`, { extraHeaders: { userid: currentUserId } }), [currentUserId]);

  const [chat, setChat] = useState<string>("");

  const { friends, getFriends } = useFriendship()

  const [onlineUsers, setOnlineUsers] = useState<Array<string>>([])

  const [selectedUser, setSelectedUser] = useState<IFriend>()

  const [messages, setMessages] = useState<Array<IMessage>>([]);
  const [messageInput, setMessageInput] = useState<string>("");

  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {

    getFriends(currentUserId, true)

    const activeChats = async () => {

      const response = await axiosInstance.get(`${process.env.CHAT_API_URL}/${currentUserId}`)
      console.log(response.data)
    }
    activeChats()

    socket.on('users', (users: any) => {
      console.log(users)
      setOnlineUsers(users)
    });
    return () => {
      socket.off('users')
      socket.disconnect()
    };

  }, [])

  useEffect(() => {
    socket.on('message', (message: any) => {
      console.log(message)
      setMessages((prev) => [...prev, message]);
    });

    handleChatContainerScroll()

    return () => {
      socket.off('message');
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!messageInput) return
    if (!selectedUser) return

    console.log("emit send message")
    const messageData: IMessage = {
      text: messageInput,
      date: new Date(),

      senderId: currentUserId,
      receiverId: selectedUser?._id
    }
    socket.emit('sendMessage', messageData);
    setMessages((prev) => [...prev, messageData]);

    const data = { text: messageInput, senderId: currentUserId, chatId: chat }
    const response = await axiosInstance.post(`${process.env.MESSAGE_API_URL}`, data)
    console.log(response.data)

    setMessageInput("");
  }

  function handleChatContainerScroll() {

    if (!chatContainerRef.current) return

    chatContainerRef.current.scroll({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth"
    });
  }

  const getUsernameById = (id: string) => friends?.find(i => i._id == id)?.username
  const getPhotoById = (id: string) => friends?.find(i => i._id == id)?.profilePhoto

  console.log(friends);


  const handleSelectUser = async (user: IFriend) => {

    console.log(user)
    setSelectedUser(user)

    const data = { firstId: currentUserId, secondId: user._id }
    const response = await axiosInstance.post(`${process.env.CHAT_API_URL}`, data)
    console.log(response.data);

    fetchUsersConversation(response.data._id, user._id)

    setChat(response.data._id)
  }

  const fetchUsersConversation = async (chatId: string, selectedUserId: string) => {

    const response = await axiosInstance.get(`${process.env.MESSAGE_API_URL}/${chatId}`)
    console.log(response.data)
    console.log("current user: ", currentUserId)
    console.log("selected user: ", selectedUserId)

    const conversation = response.data.map((msg: any) => {
      let isSenderCurrentUser = msg.senderId == currentUserId
      return {
        text: msg.text,
        date: msg.createdAt,

        senderId: isSenderCurrentUser ? currentUserId : selectedUserId,
        receiverId: isSenderCurrentUser ? selectedUserId : currentUserId,
      }
    })
    console.log(conversation)
    setMessages(conversation)
  }

  return (
    <div className="relative flex flex-col gap-y-4 justify-center items-center bg-blur-ellipse-small bg-[center_top_-1rem] bg-[length:200px] bg-no-repeat overflow-hidden">
      <div>
        <h1 className="text-5xl font-bold">Chat</h1>
      </div>
      <div className="z-10 flex w-full max-w-4xl h-[440px] rounded bg-gradient-to-br from-[#0D0D0D] to-[#472DA6] border-[#472DA6] border-2">
        <div className="basis-4/5 px-12 pt-4 pb-36">
          {
            selectedUser ?
              <>
                <div className="flex justify-between px-4 py-2.5 border-[#6841F2] border-b-2 text-lg">
                  <Link to={`/user/${selectedUser.username}`}>View Profile</Link>
                  <Link to="/account/friends">Manage Friends</Link>
                  <Link to={`/user/${selectedUser.username}`} className="text-red-600">Delete All Chat</Link>
                </div>
                <div ref={chatContainerRef} className="mt-2 mb-2 px-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-lg h-full">
                  {
                    messages && messages.map((messageData, index: number) => {

                      let isMessageBelongsCurrUser = messageData.senderId == currentUserId
                      let isSenderSamePreviousOne = messages[index - 1] ? messageData.senderId == messages[index - 1].senderId : false
                      return (
                        <div key={index} className={`relative flex items-center ${isSenderSamePreviousOne ? "mt-1" : "mt-2"} ${isMessageBelongsCurrUser ? "justify-end" : "justify-start"}`}>
                          {
                            !isSenderSamePreviousOne &&
                            <div className={`w-10 h-10 leading-9 text-xl text-center rounded-full bg-[#4F22F2] font-bold overflow-hidden ${isMessageBelongsCurrUser ? "order-last ml-1 border-2" : "mr-1"} ${messageData.date ? "mb-3" : "mb-1.5"}`}>
                              {
                                getPhotoById(messageData.senderId)
                                  ?
                                  <img src={`${process.env.API_URL}/${getPhotoById(messageData.senderId)!}`} />
                                  :
                                  getUsernameById(messageData.senderId)![0].toUpperCase()
                              }
                            </div>
                          }
                          <div className={`leading-[0.5] ${isSenderSamePreviousOne ? isMessageBelongsCurrUser ? "me-11" : "ms-11" : ""} ${isMessageBelongsCurrUser ? "text-right" : "text-left"}`}>
                            <p className={`bg-[#D5CAFF] text-black px-4 py-1 text-lg ${isMessageBelongsCurrUser ? "rounded-tl-md rounded-bl-md" : "rounded-tr-md rounded-br-md"}`}>{messageData.text}</p>
                            {
                              messageData.date &&
                              <>
                                <time className="text-[0.55rem] italic -mt-1" dateTime={(messageData.date).toString()}>
                                  {new Date(messageData.date).toLocaleTimeString()}
                                  {
                                    new Date().toDateString() !== new Date(messageData.date).toDateString()
                                    &&
                                    <>
                                      <br />
                                      {new Date(messageData.date).toDateString()}
                                    </>
                                  }
                                </time>
                              </>
                            }
                          </div>
                        </div>
                      )
                    }
                    )
                  }
                </div>
                <div className="border-2 border-[#6841F2] bg-[#6841F2] flex h-14 items-stretch overflow-hidden rounded-xl">
                  <input
                    type="text"
                    value={messageInput}
                    className="text-black text-lg flex-1 ps-4 pe-2 outline-none"
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" ? sendMessage() : null}
                    placeholder="Type your message..."
                  />
                  <button onClick={sendMessage} className="w-1/6 text-center hover:bg-[#472DA6]">
                    <IoIosSend className="text-3xl mx-auto" />
                  </button>
                </div>
              </>
              :
              <h2 className="text-center text-2xl text-slate-300">
                Please select a user for starting conversation
              </h2>
          }

        </div>
        <div className="basis-1/5 bg-[#472DA6] py-4">

          <h3 className="text-3xl font-bold text-center">Friends</h3>
          <div className="mt-2 text-slate-800 font-medium">
            {
              friends && friends.map((user: IFriend, index: number) => {

                if (user._id == currentUserId) return // if self then skip this user

                let isUserOnline = onlineUsers.includes(user._id)
                let isUserSelected = user._id == selectedUser?._id
                return (
                  <div key={index} className={`${isUserOnline ? "text-slate-800" : "text-slate-700"} ${isUserSelected ? "border-[#BCA9FF] border-2 bg-[#dbd1ff]" : "bg-[#BCA9FF]"} flex items-center gap-x-2 ps-4 mt-1.5 cursor-pointer`}
                    onClick={() => handleSelectUser(user)}>
                    <FaUserCircle />
                    <span>{user.username} ({isUserOnline ? "online" : "offline"})</span>
                  </div>)
              }
              )
            }
          </div>
          <div>
            <h4 className="text-2xl font-bold text-center">Start New Conversation</h4>
          </div>
        </div>
      </div>

      <div className="absolute top-0 -left-8">
        <img src={cosmicButterfly} className="w-[40rem] h-auto" />
      </div>

      <div className="absolute top-0 right-20">
        <img src={cosmicButterflyRight} className="w-[34rem] h-auto" />
      </div>
    </div>
  )
}

export default Chat