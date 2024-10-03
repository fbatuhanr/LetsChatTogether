/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { FaCircle } from "react-icons/fa";
import { IoIosChatboxes, IoIosSend } from "react-icons/io";

import cosmicButterfly from "../assets/background/cosmic-butterfly.png";
import cosmicButterflyRight from "../assets/background/cosmic-butterfly-right.png";

import { useDecodedToken } from "../hooks/useDecodedToken";
import useFriendship from "../hooks/api/useFriendship";
import useChat from "../hooks/api/useChat";

import { FriendProps } from "../types/User.types";
import { MessageProps } from "../types/Message.types";
import { MdCancel } from "react-icons/md";
import { textClip } from "../utils/textUtils";
import useScrollOnKeyboardClose from "../hooks/useScrollOnKeyboardClose";
import Img from "../components/general/Img";
import LoadingSpinnerPage from "../components/LoadingSpinnerPage";
import { timeAgoCalculator } from "../utils/dateUtils";

const Chat = () => {
  const decodedToken = useDecodedToken();
  const currentUserId = decodedToken.userId;
  const currentUsername = decodedToken.username;

  const [activeTab, setActiveTab] = useState(0);

  const { friends, getFriends } = useFriendship(currentUserId);
  const {
    isLoading,
    chat,
    chatContainerRef,
    onlineUsers,
    targetUser,
    conversations,
    messages,
    messageInput,
    setMessageInput,
    handleSendMessage,
    handleSelectUser,
    handleDeleteChat,
    handleDeleteMessage,
  } = useChat(currentUserId, currentUsername);
  const [sortedFriends, setSortedFriends] = useState<FriendProps[] | null>(
    null
  );

  const scrollTargetRef = useScrollOnKeyboardClose();

  useEffect(() => {
    getFriends(true);
  }, []);
  useEffect(() => {
    if (!friends || !onlineUsers || !conversations) return;

    setSortedFriends(sortedFriendsByOnlineStatus());
  }, [friends, onlineUsers, conversations, activeTab]);

  const filteredFriendsByTab =
    activeTab === 0
      ? friends?.filter((friend) =>
          conversations?.some((chat) => chat.members.includes(friend._id))
        )
      : friends;
  const sortedFriendsByOnlineStatus = () => {
    if (!filteredFriendsByTab) return null;

    return filteredFriendsByTab
      ?.filter((friend) => friend._id !== currentUserId)
      .sort((a, b) => {
        const aOnline = onlineUsers?.includes(a._id) ? 0 : 1;
        const bOnline = onlineUsers?.includes(b._id) ? 0 : 1;

        if (activeTab === 0) {
          if (aOnline === bOnline) {
            const aUpdatedAt = conversations.find((chat) =>
              chat.members.includes(a._id)
            )?.updatedAt;
            const bUpdatedAt = conversations.find((chat) =>
              chat.members.includes(b._id)
            )?.updatedAt;

            const aDate = aUpdatedAt
              ? new Date(aUpdatedAt).getTime()
              : -Infinity;
            const bDate = bUpdatedAt
              ? new Date(bUpdatedAt).getTime()
              : -Infinity;

            return bDate - aDate;
          }
          return aOnline - bOnline;
        } else {
          
          return a.username.localeCompare(b.username);
        }
      });
  };

  const getUsernameById = (id: string) =>
    friends?.find((i) => i._id === id)?.username;
  const getPhotoById = (id: string) =>
    friends?.find((i) => i._id === id)?.profilePhoto;

  const renderMessageHeader = (
    messageData: MessageProps,
    isMessageBelongsCurrUser: boolean,
    isSenderSamePreviousOne: boolean
  ) => {
    const deleteMessageButton = (
      <button
        className={`mb-2 mx-1 ${
          isMessageBelongsCurrUser ? "order-first" : "order-last"
        }`}
        onClick={() => handleDeleteMessage(messageData._id)}
      >
        <MdCancel size={18} color="#ee3e2c" opacity={0.5} />
      </button>
    );

    if (isSenderSamePreviousOne)
      return isMessageBelongsCurrUser ? deleteMessageButton : null;

    const profilePic = getPhotoById(messageData.senderId);
    const initials = getUsernameById(messageData.senderId)?.[0].toUpperCase();
    const avatarClasses = `w-10 h-10 leading-9 text-xl text-center rounded-full overflow-hidden ${
      isMessageBelongsCurrUser ? "order-1 ml-1 border-2" : "mr-1"
    } ${messageData.date ? "mb-3" : "mb-1.5"}`;
    const bgColor = `bg-[#4F22F2]`;
    return (
      <>
        {isMessageBelongsCurrUser && deleteMessageButton}
        <div className={`${avatarClasses} ${bgColor}`}>
          {profilePic ? (
            <Img src={profilePic} width="100%" height="100%" />
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
    const isDifferentDay =
      new Date().toDateString() !== messageDate.toDateString();

    return (
      <time
        className="text-[0.55rem] italic -mt-1"
        dateTime={messageDate.toString()}
      >
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
    <div
      ref={scrollTargetRef}
      className="px-2 lg:px-0 relative flex flex-col gap-y-4 justify-center items-center bg-blur-ellipse-small bg-[center_top_-1rem] bg-[length:200px] bg-no-repeat overflow-hidden"
    >
      <div>
        <h1 className="text-5xl font-bold">Chat</h1>
      </div>
      <div className="z-10 flex flex-col lg:flex-row w-full max-w-4xl h-[600px] lg:h-[450px] rounded bg-gradient-to-br from-[#0D0D0D] to-[#472DA6] border-[#472DA6] border-2">
        <div className="h-full px-2 pt-2 lg:w-[79%] lg:px-8 relative">
          {isLoading ? (
            <LoadingSpinnerPage />
          ) : chat && targetUser ? (
            <>
              <div className="absolute -top-6 mt-0.5 left-4 text-[0.8rem]">
                <p>Conversation created: <b>{timeAgoCalculator(chat.createdAt)}</b></p>
              </div>
              <div className="flex justify-center gap-x-1 py-1.5 lg:justify-between lg:px-4 lg:py-1.5 border-[#6841F2] border-b-2 text-base font-medium lg:text-lg">
                <Link
                  to={`/user/${targetUser.username}`}
                  className="bg-[#0D0D0D] bg-opacity-50 rounded-sm p-1.5 lg:p-2 lg:w-full text-center"
                >
                  View {textClip(targetUser.username, 10)}
                </Link>
                <Link
                  to="/account/friends"
                  className="bg-[#0D0D0D] bg-opacity-50 rounded-sm p-1.5 lg:p-2 lg:w-full text-center"
                >
                  Manage Friends
                </Link>
                <button
                  onClick={handleDeleteChat}
                  className="text-red-600 bg-[#0D0D0D] bg-opacity-50 rounded-sm p-1.5 lg:p-2 lg:w-full text-center"
                >
                  Delete Chat
                </button>
              </div>
              <div
                ref={chatContainerRef}
                className="h-[18.5rem] lg:h-72 mt-2 mb-2 px-0 lg:px-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-lg"
              >
                {messages.map((messageData: MessageProps, index) => {
                  const isMessageBelongsCurrUser =
                    messageData.senderId === currentUserId;
                  const isSenderSamePreviousOne =
                    index > 0 &&
                    messageData.senderId === messages[index - 1].senderId;

                  return (
                    <div
                      key={index}
                      className={`relative flex items-center ${
                        isSenderSamePreviousOne ? "mt-1" : "mt-2"
                      } ${
                        isMessageBelongsCurrUser
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {renderMessageHeader(
                        messageData,
                        isMessageBelongsCurrUser,
                        isSenderSamePreviousOne
                      )}

                      <div
                        className={`leading-[0.5] ${
                          isSenderSamePreviousOne
                            ? isMessageBelongsCurrUser
                              ? "me-11"
                              : "ms-11"
                            : ""
                        } ${
                          isMessageBelongsCurrUser ? "text-right" : "text-left"
                        }`}
                      >
                        <p
                          className={`bg-[#D5CAFF] text-black px-4 py-1 text-lg ${
                            isMessageBelongsCurrUser
                              ? "rounded-tl-md rounded-bl-md"
                              : "rounded-tr-md rounded-br-md"
                          }`}
                        >
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
                  onKeyDown={(e) =>
                    e.key === "Enter" ? handleSendMessage() : null
                  }
                  placeholder="Type your message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="w-1/6 text-center hover:bg-[#472DA6]"
                >
                  <IoIosSend className="text-3xl mx-auto" />
                </button>
              </div>
            </>
          ) : (
            <div className="mt-8 text-center text-3xl text-slate-300">
              {friends && friends?.length > 1 ? (
                <p>Please select a friend for starting conversation</p>
              ) : (
                <Link to="/users">
                  <p>You don't have any friends!</p>
                  <p>
                    <span className="text-white">add new friends</span> to start
                    chatting
                  </p>
                </Link>
              )}
            </div>
          )}
        </div>
        <div className="order-first py-2 lg:pt-2.5 lg:w-[21%] lg:order-last bg-[#472DA6]">
          <h3 className="px-4 text-2xl lg:text-[1.75rem] font-bold lg:text-center mb-1.5">
            Friends ({friends?.length ? friends?.length - 1 : 0})
          </h3>
          <div className="flex justify-stretch border-t border-b border-[#2f1c74] -mr-[2px] mb-1">
            <button
              className={`w-full py-1 ${activeTab === 0 && "bg-[#2f1c74]"}`}
              onClick={() => setActiveTab(0)}
            >
              Chats
            </button>
            <button
              className={`w-full py-1 ${activeTab === 1 && "bg-[#2f1c74]"}`}
              onClick={() => setActiveTab(1)}
            >
              All Friends
            </button>
          </div>
          <div className="h-24 max-h-24 lg:h-auto lg:max-h-[357px] overflow-y-auto overflow-x-hidden scrollbar-thick scrollbar-thumb-gray-500 scrollbar-track-gray-200">
            <div className="px-12 lg:px-0 font-medium">
              {sortedFriends &&
                sortedFriends.map((user: FriendProps, index: number) => {
                  const isUserOnline = onlineUsers
                    ? onlineUsers.includes(user._id)
                    : false;
                  const isUserSelected = user._id == targetUser?._id;
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-evenly lg:justify-between lg:gap-x-1 ps-4 lg:ps-2 lg:pe-2 pt-1.5 pb-1 ${
                        index !== 0 && "mt-1.5"
                      } rounded lg:rounded-none cursor-pointer ${
                        isUserOnline ? "text-slate-800" : "text-slate-700"
                      } ${
                        isUserSelected
                          ? "bg-[#e3dbff] font-semibold"
                          : "bg-[#BCA9FF]"
                      }`}
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="flex items-center gap-x-1.5">
                        {isUserOnline ? (
                          <FaCircle size={17} className="text-green-600" />
                        ) : (
                          <FaCircle size={17} className="text-red-600" />
                        )}
                        <span
                          className={`${
                            isUserSelected ? "text-xl underline" : "text-lg"
                          }`}
                        >
                          {textClip(user.username, 8)}
                        </span>
                        {/* <span className="text-xs lg:text-[0.65rem] mt-1 lg:mt-0.5">({isUserOnline ? "online" : "offline"})</span> */}
                      </div>
                      <div>
                        <IoIosChatboxes
                          size={24}
                          className={`${
                            isUserOnline ? "text-slate-800" : "text-slate-700"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
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
  );
};

export default Chat;
