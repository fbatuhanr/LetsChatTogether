import FriendList from "./FriendList";
import FriendHeader from "./FriendHeader";
import { useState } from "react";

const ChatSidebar: React.FC = () => {

  const [activeTab, setActiveTab] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="order-first py-1 lg:pt-2.5 lg:w-[22%] lg:order-last bg-[#472DA6] relative">
      <FriendHeader activeTab={activeTab} setActiveTab={setActiveTab} setIsExpanded={setIsExpanded} />
      <FriendList activeTab={activeTab} isExpanded={isExpanded} setIsExpanded={setIsExpanded}/>
    </div>
  );
};

export default ChatSidebar;
