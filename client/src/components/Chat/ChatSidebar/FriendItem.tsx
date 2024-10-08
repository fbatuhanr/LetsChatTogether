import { FaCircle } from "react-icons/fa";
import { IoIosChatboxes, IoIosNotifications } from "react-icons/io";
import { textClip } from "../../../utils/textUtils";
import { FriendProps } from "../../../types/User.types";

interface FriendItemProps {
  user: FriendProps;
  isSelected: boolean;
  isOnline: boolean;
  unreadMessageCount: number;
  handleSelectUser: (user: FriendProps) => void;
  setIsExpanded: (status: boolean) => void;
  isUserSelectionInProgress: boolean;
}

const FriendItem: React.FC<FriendItemProps> = ({
  user,
  isSelected,
  isOnline,
  unreadMessageCount,
  handleSelectUser,
  setIsExpanded,
  isUserSelectionInProgress,
}) => {

  return (
    <div
      className={`flex items-center justify-between lg:gap-x-1 ps-12 pe-16 lg:ps-2 lg:pe-2 pt-1.5 pb-1 mb-1 rounded lg:rounded-none 
        ${isUserSelectionInProgress ? "cursor-wait opacity-75" : "cursor-pointer"}
        ${isSelected ? "bg-[#e3dbff] font-semibold" : "bg-[#BCA9FF]"} 
        ${isOnline ? "text-slate-800" : "text-slate-700"}`}
      onClick={() => {
        if (isUserSelectionInProgress) return;
        handleSelectUser(user);
        setIsExpanded(false);
      }}
    >
      <div className="flex items-center gap-x-1.5">
        {isOnline ? (
          <FaCircle size={17} className="text-green-600" />
        ) : (
          <FaCircle size={17} className="text-red-600" />
        )}
        <span
          className={`text-base lg:text-lg ${
            isSelected ? "text-lg lg:text-xl underline" : ""
          }`}
        >
          {textClip(user.username, 8)}
        </span>
      </div>
      {!isSelected && unreadMessageCount > 0 && (
        <div className="flex items-center text-white font-bold text-sm ps-[3px] pe-[6px] rounded bg-[#6841f2]">
          <div className="flex items-center animate-bounceNotify">
            <IoIosNotifications size={18} />
            {unreadMessageCount}
          </div>
        </div>
      )}
      <div>
        <IoIosChatboxes
          size={24}
          className={`${isOnline ? "text-slate-800" : "text-slate-700"}`}
        />
      </div>
    </div>
  );
};

export default FriendItem;
