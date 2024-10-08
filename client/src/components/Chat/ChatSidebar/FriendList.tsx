/* eslint-disable react-hooks/exhaustive-deps */
import FriendItem from "./FriendItem";
import { FriendProps } from "../../../types/User.types";
import { useChatContext } from "../../../contexts/ChatContext";
import { useEffect, useRef, useState } from "react";
import LoadingDots from "../../loading/LoadingDots";
import { MdCompress, MdExpand } from "react-icons/md";
import useIsMobile from "../../../hooks/useIsMobile";

const FriendList: React.FC<{ activeTab: number }> = ({ activeTab }) => {
  const isMobile = useIsMobile(1024);
  const [isExpanded, setIsExpanded] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const {
    currentUserId,
    activeSelection,
    friends,
    onlineUsers,
    chats,
    handleSelectUser,
    isLoadingFriends,
    isUserSelectionInProgress,
  } = useChatContext();
  const [sortedFriends, setSortedFriends] = useState<FriendProps[]>([]);

  useEffect(() => {
    const filteredFriendsByTab =
      activeTab === 0
        ? friends.filter((friend) =>
            chats.some((chat) => chat.members.includes(friend._id))
          )
        : friends;

    const sorted = filteredFriendsByTab
      .filter((friend) => friend._id !== currentUserId)
      .sort((a, b) => {
        const aOnline = onlineUsers.includes(a._id) ? 0 : 1;
        const bOnline = onlineUsers.includes(b._id) ? 0 : 1;

        if (aOnline !== bOnline) {
          return aOnline - bOnline;
        }

        return a.username.localeCompare(b.username);
      });

    setSortedFriends(sorted);
  }, [friends, onlineUsers, chats, activeTab]);

  const getUnreadMessageCountById = (id: string): number => {
    const chat = chats?.find(
      (chat) =>
        chat.members.includes(currentUserId) && chat.members.includes(id)
    );
    return chat?.unreadMessagesCount ?? 0;
  };

  useEffect(() => {
    if (listRef.current && isMobile) {
      listRef.current.style.height = isExpanded
        ? `${
            listRef.current.scrollHeight < 350
              ? `${listRef.current.scrollHeight}px`
              : "350px"
          }`
        : "64px";
    }
  }, [isExpanded, isMobile]);

  return (
    <>
      {isMobile && (
        <button
          type="button"
          className="absolute p-4 top-[50px] right-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <MdCompress color="#ffffff" size={28} className="-mr-0.5" />
          ) : (
            <MdExpand color="#ffffff" size={26} />
          )}
        </button>
      )}
      <div
        ref={listRef}
        style={isMobile ? { height: "64px" } : undefined}
        className="lg:h-auto lg:max-h-[360px] mt-1 transition-height duration-500 ease-in-out overflow-y-auto overflow-x-hidden scrollbar-thick scrollbar-thumb-gray-500 scrollbar-track-gray-200"
      >
        <div className="ps-10 pe-16 lg:px-0 font-medium">
          {isLoadingFriends ? (
            <LoadingDots />
          ) : (
            <>
              {sortedFriends.map((user: FriendProps, index: number) => {
                const isOnline = onlineUsers.includes(user._id);
                const isSelected = user._id === activeSelection.user?._id;
                return (
                  <FriendItem
                    key={index}
                    user={user}
                    isOnline={isOnline}
                    isSelected={isSelected}
                    unreadMessageCount={getUnreadMessageCountById(user._id)}
                    handleSelectUser={handleSelectUser}
                    setIsExpanded={setIsExpanded}
                    isUserSelectionInProgress={isUserSelectionInProgress}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FriendList;
