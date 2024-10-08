import React from "react";

import { Link } from "react-router-dom";
import { useChatContext } from "../../../contexts/ChatContext";

import LoadingSpinnerPage from "../../loading/LoadingSpinnerPage";

import MessageHeader from "./MessageHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatContainer: React.FC = () => {
  const { activeSelection, friendsCount, isLoadingFriends, isLoadingMessages } = useChatContext();
  return (
    <div className="h-full px-2 lg:pt-2 lg:w-[78%] lg:px-8 relative">
      {(isLoadingFriends || isLoadingMessages) ? (
        <LoadingSpinnerPage />
      ) : (
        <>
          {activeSelection.chat && activeSelection.user ? (
            <>
              <MessageHeader />
              <MessageList />
              <MessageInput />
            </>
          ) : (
            <div className="mt-8 text-center text-3xl text-slate-300">
              {friendsCount > 0 ? (
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
        </>
      )}
    </div>
  );
};

export default ChatContainer;
