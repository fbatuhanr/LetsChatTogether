import React from "react";
import { MessageChatProps } from "../../../types/Message.types";
import { MdCancel } from "react-icons/md";
import Img from "../../general/Img";

interface MessageItemProps {
  messageData: MessageChatProps;
  isMessageBelongsCurrentUser: boolean;
  isSenderSamePreviousOne: boolean;
  handleDeleteMessage: (id: string) => void;
  isMessageDeletionInProgress: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  messageData,
  isMessageBelongsCurrentUser,
  isSenderSamePreviousOne,
  handleDeleteMessage,
  isMessageDeletionInProgress,
}) => {
  const deleteMessageButton = (
    <button
      className={`mb-2 mx-1 
        ${isMessageBelongsCurrentUser ? "order-first" : "order-last"}
        ${isMessageDeletionInProgress && "cursor-wait"}`}
      onClick={() => {
        if (isMessageDeletionInProgress) return;
        handleDeleteMessage(messageData._id);
      }}
    >
      <MdCancel size={18} color="#ee3e2c" opacity={0.5} />
    </button>
  );

  const renderMessageHeader = () => {
    if (isSenderSamePreviousOne) {
      return isMessageBelongsCurrentUser ? deleteMessageButton : null;
    }

    const profilePhoto = messageData.senderProfilePhoto;
    const usernameInitial = messageData.senderUsername?.[0].toUpperCase();
    const avatarClasses = `w-10 h-10 min-w-10 min-h-10 leading-9 text-xl text-center rounded-full overflow-hidden 
        ${isMessageBelongsCurrentUser ? "order-1 ml-1 border-2" : "mr-1"} 
        ${messageData.date ? "mb-3" : "mb-1.5"}`;
    const bgColor = `${
      profilePhoto
        ? "bg-gray-300 animate-shimmer bg-gradient-to-r from-gray-300 via-gray-50 to-gray-300 bg-[length:200%_100%]"
        : "bg-[#4F22F2]"
    }`;

    return (
      <>
        {isMessageBelongsCurrentUser && deleteMessageButton}
        <div className={`${avatarClasses} ${bgColor}`}>
          {profilePhoto ? (
            <Img src={profilePhoto} width="100%" height="100%" />
          ) : (
            usernameInitial
          )}
        </div>
      </>
    );
  };

  const renderMessageDate = (date: Date | string | null) => {
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
            {messageDate.toLocaleDateString()}
          </>
        )}
      </time>
    );
  };

  return (
    <div
      className={`relative flex items-center 
        ${isSenderSamePreviousOne ? "mt-1" : "mt-2"} 
        ${isMessageBelongsCurrentUser ? "justify-end" : "justify-start"}
        ${isMessageDeletionInProgress && "opacity-50"}`}
    >
      {renderMessageHeader()}

      <div
        className={`leading-[0.5] max-w-[calc(85%)] ${
          isSenderSamePreviousOne
            ? isMessageBelongsCurrentUser
              ? "me-11"
              : "ms-11"
            : ""
        } ${isMessageBelongsCurrentUser ? "text-right" : "text-left"}`}
      >
        <p
          className={`bg-[#D5CAFF] text-black break-words px-4 py-1 text-lg ${
            isMessageBelongsCurrentUser
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
};

export default MessageItem;
