import Button from "../../general/clickable/Button";
import { IoIosSend } from "react-icons/io";
import { CiNoWaitingSign } from "react-icons/ci";
import { useChatContext } from "../../../contexts/ChatContext";

const MessageInput: React.FC = () => {

  const { messageInput, setMessageInput, handleSendMessage, isMessageSending } = useChatContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isMessageSending) {
      handleSendMessage();
    }
  };

  return (
    <div className="border-2 border-[#6841F2] bg-[#6841F2] flex h-14 items-stretch overflow-hidden rounded">
      <input
        type="text"
        value={messageInput}
        className="text-black text-lg flex-1 ps-4 pe-2 outline-none"
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
      />
      <Button
        color="secondary"
        onClick={handleSendMessage}
        className="!w-24 text-center hover:bg-[#472DA6]"
        disabled={isMessageSending}
        iconBegin={
          !isMessageSending ? (
            <IoIosSend className="text-3xl" />
          ) : (
            <CiNoWaitingSign className="text-2xl" />
          )
        }
      />
    </div>
  );
};

export default MessageInput;
