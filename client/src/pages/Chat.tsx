import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { FaUserCircle } from 'react-icons/fa'
import { IoIosSend } from 'react-icons/io'

import cosmicButterfly from "../assets/background/cosmic-butterfly.png"
import cosmicButterflyRight from "../assets/background/cosmic-butterfly-right.png"

import { useDecodedToken } from '../hooks/useDecodedToken'
import useFriendship from '../hooks/api/useFriendship'
import useChat from '../hooks/api/useChat'

import { FriendProps } from '../types/User.types'
import { MessageProps } from '../types/Message.types'
import { MdCancel } from 'react-icons/md'


const Chat = () => {

  const decodedToken = useDecodedToken()
  const currentUserId = decodedToken.userId
  const currentUsername = decodedToken.username

  const { friends, getFriends } = useFriendship(currentUserId)

  const {
    chatContainerRef,
    onlineUsers,
    targetUser,
    messages,
    messageInput,
    setMessageInput,
    handleSendMessage,
    handleSelectUser,

    handleDeleteChat,
    handleDeleteMessage
  } = useChat(currentUserId, currentUsername);


  useEffect(() => {
    getFriends(true)
  }, [])

  const getUsernameById = (id: string) => friends?.find((i) => i._id === id)?.username;
  const getPhotoById = (id: string) => friends?.find((i) => i._id === id)?.profilePhoto;


  const renderMessageHeader = (messageData: MessageProps, isMessageBelongsCurrUser: boolean, isSenderSamePreviousOne: boolean) => {
    
    const deleteMessageButton = 
      <button className={`mb-2 mx-1 ${isMessageBelongsCurrUser ? "order-first" : "order-last"}`}
        onClick={() => handleDeleteMessage(messageData._id)}>
        <MdCancel size={18} color='#ee3e2c' opacity={0.5}/>
      </button>

    if (isSenderSamePreviousOne) return isMessageBelongsCurrUser ? deleteMessageButton : null

    const profilePic = getPhotoById(messageData.senderId);
    const initials = getUsernameById(messageData.senderId)?.[0].toUpperCase();
    const avatarClasses = `w-10 h-10 leading-9 text-xl text-center rounded-full overflow-hidden ${isMessageBelongsCurrUser ? 'order-1 ml-1 border-2' : 'mr-1'} ${messageData.date ? 'mb-3' : 'mb-1.5'}`;
    const bgColor = `bg-[#4F22F2]`;

    return (
      <>
        {isMessageBelongsCurrUser && deleteMessageButton}
        <div className={`${avatarClasses} ${bgColor}`}>
          {profilePic ? (
            <img src={`${process.env.API_URL}/${profilePic}`} alt="Profile" />
          ) : (
            initials
          )}
        </div>
      </>
    );
  };
  const renderMessageDate = (date?: Date | null) => {
    if (!date) return null;

    const messageDate = new Date(date);
    const isDifferentDay = new Date().toDateString() !== messageDate.toDateString();

    return (
      <time className="text-[0.55rem] italic -mt-1" dateTime={messageDate.toString()}>
        {messageDate.toLocaleTimeString()}
        {isDifferentDay && (
          <>
            <br />
            {messageDate.toDateString()}
          </>
        )}
      </time>
    );
  };

  return (
    <div className="relative flex flex-col gap-y-4 justify-center items-center bg-blur-ellipse-small bg-[center_top_-1rem] bg-[length:200px] bg-no-repeat overflow-hidden">
      <div>
        <h1 className="text-5xl font-bold">Chat</h1>
      </div>
      <div className="z-10 flex w-full max-w-4xl h-[440px] rounded bg-gradient-to-br from-[#0D0D0D] to-[#472DA6] border-[#472DA6] border-2">
        <div className="basis-4/5 px-12 pt-4 pb-36">
          {
            targetUser ?
              <>
                <div className="flex justify-between px-4 py-2.5 border-[#6841F2] border-b-2 text-lg">
                  <Link to={`/user/${targetUser.username}`}>View Profile</Link>
                  <Link to="/account/friends">Manage Friends</Link>
                  <button onClick={handleDeleteChat} className="text-red-600">Delete Chat</button>
                </div>
                <div
                  ref={chatContainerRef}
                  className="mt-2 mb-2 px-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-lg h-full"
                >
                  {messages.map((messageData: MessageProps, index) => {
                    const isMessageBelongsCurrUser = messageData.senderId === currentUserId;
                    const isSenderSamePreviousOne = index > 0 && messageData.senderId === messages[index - 1].senderId;

                    return (
                      <div key={index}
                        className={`relative flex items-center ${isSenderSamePreviousOne ? 'mt-1' : 'mt-2'} ${isMessageBelongsCurrUser ? 'justify-end' : 'justify-start'}`}>

                        {renderMessageHeader(messageData, isMessageBelongsCurrUser, isSenderSamePreviousOne)}

                        <div className={`leading-[0.5] ${isSenderSamePreviousOne ? (isMessageBelongsCurrUser ? 'me-11' : 'ms-11') : ''} ${isMessageBelongsCurrUser ? 'text-right' : 'text-left'}`}>
                          <p className={`bg-[#D5CAFF] text-black px-4 py-1 text-lg ${isMessageBelongsCurrUser ? 'rounded-tl-md rounded-bl-md' : 'rounded-tr-md rounded-br-md'}`}>
                            {messageData.text}
                          </p>
                          {renderMessageDate(messageData.date)}
                        </div>

                      </div>
                    );
                  })}
                </div>
                <div className="border-2 border-[#6841F2] bg-[#6841F2] flex h-14 items-stretch overflow-hidden rounded-xl">
                  <input
                    type="text"
                    value={messageInput}
                    className="text-black text-lg flex-1 ps-4 pe-2 outline-none"
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" ? handleSendMessage() : null}
                    placeholder="Type your message..."
                  />
                  <button onClick={handleSendMessage} className="w-1/6 text-center hover:bg-[#472DA6]">
                    <IoIosSend className="text-3xl mx-auto" />
                  </button>
                </div>
              </>
              :
              <h2 className="mt-8 text-center text-3xl text-slate-300">
                {
                  (friends && friends?.length > 1) 
                  ? "Please select a friend for starting conversation"
                  : "You don't have any friends, add new friends to start chatting!"
                }
              </h2>
          }

        </div>
        <div className="basis-1/5 bg-[#472DA6] py-4">

          <h3 className="text-3xl font-bold text-center">Friends</h3>
          <div className="mt-2 text-slate-800 font-medium">
            {
              friends && friends.map((user: FriendProps, index: number) => {

                if (user._id == currentUserId) return // if self then skip this user

                let isUserOnline = onlineUsers ? onlineUsers.includes(user._id) : false
                let isUserSelected = user._id == targetUser?._id
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
            <h4 className="text-2xl font-bold text-center">&nbsp;</h4>
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