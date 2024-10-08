import { MessageChatProps, MessageProps } from "../../../types/Message.types";
import { useChatContext } from "../../../contexts/ChatContext";
import MessageItem from "./MessageItem";

const MessageList: React.FC = () => {
  const {
    currentUserId,
    friends,
    messages,
    handleDeleteMessage,
    chatContainerRef,

    isMessageDeletionInProgress
  } = useChatContext();

  const getUsernameById = (id: string) =>
    friends?.find((i) => i._id === id)?.username;
  const getPhotoById = (id: string) =>
    friends?.find((i) => i._id === id)?.profilePhoto;

  const chatMessages: MessageChatProps[] = messages.map(
    (message: MessageProps) => ({
      _id: message._id,
      senderId: message.senderId,
      text: message.text,
      date: message.date,
      senderUsername: getUsernameById(message.senderId),
      senderProfilePhoto: getPhotoById(message.senderId),
    })
  );

  return (
    <div
      ref={chatContainerRef}
      className="h-[296px] lg:h-72 mt-4 lg:mt-2 mb-2 px-0 lg:px-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-lg"
    >
      {chatMessages.map((messageData: MessageChatProps, index) => {
        const isMessageBelongsCurrentUser =
          messageData.senderId === currentUserId;
        const isSenderSamePreviousOne =
          index > 0 &&
          messageData.senderId === chatMessages[index - 1].senderId;
        return (
          <MessageItem
            key={messageData._id}
            messageData={messageData}
            isMessageBelongsCurrentUser={isMessageBelongsCurrentUser}
            isSenderSamePreviousOne={isSenderSamePreviousOne}
            handleDeleteMessage={handleDeleteMessage}
            isMessageDeletionInProgress={isMessageDeletionInProgress}
          />
        );
      })}
    </div>
  );
};

export default MessageList;
