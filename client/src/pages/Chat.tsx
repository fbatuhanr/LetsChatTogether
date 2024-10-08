/* eslint-disable react-hooks/exhaustive-deps */
import cosmicButterfly from "../assets/background/cosmic-butterfly.png";
import cosmicButterflyRight from "../assets/background/cosmic-butterfly-right.png";

import { useDecodedToken } from "../hooks/useDecodedToken";
import { ChatProvider } from "../contexts/ChatContext";

import ChatContainer from "../components/Chat/ChatContainer/index";
import ChatSidebar from "../components/Chat/ChatSidebar/index";

const Chat = () => {
  const decodedToken = useDecodedToken();
  const currentUserId = decodedToken.userId;
  const currentUsername = decodedToken.username;

  return (
    <ChatProvider
      currentUserId={currentUserId}
      currentUsername={currentUsername}
    >
      <div className="-mt-2 lg:mt-0 px-2 lg:px-0 relative flex flex-col gap-y-3 lg:gap-y-4 justify-center items-center bg-blur-ellipse-small bg-[center_top_-1rem] bg-[length:200px] bg-no-repeat overflow-hidden">
        <div>
          <h1 className="text-5xl font-bold">Chat</h1>
        </div>
        <div className="z-10 flex flex-col lg:flex-row w-full max-w-4xl h-[545px] lg:h-[450px] rounded bg-gradient-to-br from-[#0D0D0D] to-[#472DA6] border-[#472DA6] border-2">
          <ChatContainer />
          <ChatSidebar />
        </div>
        <div className="absolute top-0 -left-8">
          <img src={cosmicButterfly} className="w-[40rem] h-auto" />
        </div>
        <div className="absolute top-0 right-20">
          <img src={cosmicButterflyRight} className="w-[34rem] h-auto" />
        </div>
      </div>
    </ChatProvider>
  );
};

export default Chat;
