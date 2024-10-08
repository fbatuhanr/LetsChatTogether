import { useChatContext } from "../../../contexts/ChatContext";

interface FriendHeaderProps {
  activeTab: number;
  setActiveTab: (tabIndex: number) => void;
  setIsExpanded: (status: boolean) => void;
}
const FriendHeader: React.FC<FriendHeaderProps> = ({
  activeTab,
  setActiveTab,
  setIsExpanded,
}) => {
  const { friendsCount, chatsCount, isLoadingChats } = useChatContext();
  return (
    <div>
      <h3 className="hidden lg:block px-4 text-2xl lg:text-[1.75rem] font-bold lg:text-center mb-1.5">
        Friends {friendsCount > 0 && `(${friendsCount})`}
      </h3>
      <div className="flex justify-stretch border-t border-b border-[#2f1c74] -ml-[2px] -mr-[2px] lg:ml-0">
        <button
          className={`w-full py-1 ${activeTab === 0 && "bg-[#2f1c74]"}`}
          onClick={() => {
            setActiveTab(0);
            setIsExpanded(false);
          }}
        >
          Chats {!isLoadingChats && `(${chatsCount})`}
        </button>
        <button
          className={`w-full py-1 ${activeTab === 1 && "bg-[#2f1c74]"}`}
          onClick={() => {
            setActiveTab(1);
            setIsExpanded(false);
          }}
        >
          All Friends{" "}
          <span className="lg:hidden">
            {friendsCount > 0 && `(${friendsCount})`}
          </span>
        </button>
      </div>
    </div>
  );
};

export default FriendHeader;
