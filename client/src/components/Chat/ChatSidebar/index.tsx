import FriendList from "./FriendList";
import FriendHeader from "./FriendHeader";
import { useState } from "react";

const ChatSidebar: React.FC = () => {

  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="order-first py-1 lg:pt-2.5 lg:w-[22%] lg:order-last bg-[#472DA6] relative">
      <FriendHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <FriendList activeTab={activeTab} />
    </div>
  );
};

export default ChatSidebar;
