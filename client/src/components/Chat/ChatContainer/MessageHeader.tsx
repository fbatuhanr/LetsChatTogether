import { Link } from "react-router-dom";
import { timeAgoCalculator } from "../../../utils/dateUtils";
import { useChatContext } from "../../../contexts/ChatContext";

const MessageHeader: React.FC = () => {
  
  const { activeSelection:{chat, user}, handleDeleteChat } = useChatContext();

  if(!chat || !user) return;
  return (
    <div className="relative">
      <div className="absolute top-[52px] left-0 right-0 text-center lg:text-left lg:-top-8 lg:mt-0.5 lg:left-4 lg:right-auto text-[0.7rem] lg:text-[0.8rem]">
        <p>
          Created: <b>{timeAgoCalculator(chat.createdAt)}</b>
        </p>
      </div>
      <div className="flex justify-center gap-x-1 py-1.5 lg:justify-between lg:px-4 lg:py-1.5 border-[#6841F2] border-b-2 text-base font-medium lg:text-lg">
        <Link
          to={`/user/${user.username}`}
          className="text-[#f1c40f] bg-[#0D0D0D] bg-opacity-50 hover:bg-opacity-75 rounded-sm p-1.5 lg:p-2 lg:w-full text-center"
        >
          {user.username}
        </Link>
        <Link
          to="/account/friends"
          className="bg-[#0D0D0D] bg-opacity-50 hover:bg-opacity-75 rounded-sm p-1.5 lg:p-2 lg:w-full text-center"
        >
          Manage Friends
        </Link>
        <button
          onClick={handleDeleteChat}
          className="text-red-600 bg-[#0D0D0D] bg-opacity-50 hover:bg-opacity-75 rounded-sm p-1.5 lg:p-2 lg:w-full text-center"
        >
          Delete Chat
        </button>
      </div>
    </div>
  );
};

export default MessageHeader;
