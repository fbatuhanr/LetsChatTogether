import { useEffect, useMemo, useRef, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'

import io from 'socket.io-client';
import Message from '../components/Message';
import axios from 'axios';
import { useAppSelector } from '../redux/hooks';
import { IoIosSend } from 'react-icons/io';

const Chat = () => {

  const user = useAppSelector((state) => state.user)
  const userId = user ? user.id : null

  const socket = useMemo(() => io(`${process.env.API_URL}`, { extraHeaders: { userid: userId } }), []);

  const [users, setUsers] = useState<Array<any>>([])
  const [onlineUsers, setOnlineUsers] = useState<Array<string>>([])

  const [selectedUser, setSelectedUser] = useState()

  const [messages, setMessages] = useState<Array<any>>([]);
  const [messageText, setMessageText] = useState<string>("");

  const chatContainerRef = useRef(null)

  useEffect(() => {

    const fetchUsersExceptCurrent = async () => {

      const response = await axios.get(`${process.env.USER_API_URL}`)
      console.log(response.data);

      return response.data
    }
    fetchUsersExceptCurrent().then(response => setUsers(response));


    socket.on('users', (users: any) => {
      console.log(users)
      setOnlineUsers(users)
    });
    return () => {
      socket.off('users');
    };

  }, [])

  useEffect(() => {
    socket.on('message', (message: any) => {
      console.log(message)
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('message');
    }
  }, [messages]);

  const sendMessage = () => {
    if(!messageText) return

    console.log("emit send message")
    const messageData = { text: messageText, sender: userId, receiver: selectedUser?._id };
    socket.emit('sendMessage', messageData);
    setMessages((prev) => [...prev, messageData]);
    setMessageText("");

    chatContainerRef.current.scroll({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth"
    });
  }

  const getUsernameById = (id: string) => users.find(i => i._id == id).username

  return (

    <div className="py-8 flex flex-col gap-y-6 justify-center items-center bg-blur-ellipse-small bg-[center_top_-1rem] bg-[length:200px] bg-no-repeat overflow-hidden">
      <div>
        <h1 className="text-5xl font-bold">Chat</h1>
      </div>
      <div className="flex w-full max-w-3xl h-[425px] rounded-xl bg-gradient-to-br from-[#0D0D0D] to-[#472DA6] border-[#472DA6] border-2">

        <div className="basis-3/4 px-12 pt-8 pb-24">
          {
            selectedUser ?
              <>
                <div ref={chatContainerRef} className="border-2 border-[#6841F2] overflow-y-auto rounded-xl h-full py-4 px-2">
                  {
                    messages && messages.map((messageData, index) => {

                      let isMessageBelongsCurrUser = messageData.sender == userId
                      let isSenderSamePreviousOne = messages[index-1] ? messageData.sender == messages[index-1].sender : false
                      return (
                        <p className={`flex items-center my-0.5 ${isMessageBelongsCurrUser ? "justify-end" : "justify-start"}`}>

                          {
                            !isSenderSamePreviousOne &&
                            <span className={`w-10 h-10 leading-9 text-xl text-center rounded-full bg-[#4F22F2] font-bold ${isMessageBelongsCurrUser ? "order-last ml-1 border-2" : "mr-1"}`}>{getUsernameById(messageData.sender)[0].toUpperCase()}</span>
                          }
                          <span className={`${isMessageBelongsCurrUser ? "rounded-tl-md rounded-bl-md" : "rounded-tr-md rounded-br-md"} ${isSenderSamePreviousOne ? isMessageBelongsCurrUser ? "me-11" : "ms-11" : ""} bg-[#D5CAFF] text-black px-4 text-lg`}>{messageData.text}</span>
                        </p>
                      )
                    }
                    )
                  }
                </div>
                <div className="border-2 border-[#6841F2] bg-[#6841F2] flex h-16 items-stretch overflow-hidden rounded-xl mt-2">
                  <input
                    type="text"
                    value={messageText}
                    className="text-black text-lg flex-1 ps-4 pe-2 outline-none"
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" ? sendMessage() : null}
                    placeholder="Type your message..."
                  />
                  <button onClick={sendMessage} className="w-1/6 text-center hover:bg-[#472DA6]">
                    <IoIosSend className="text-3xl mx-auto" />
                  </button>
                </div>
              </>
              :
              <h2 className="text-center text-2xl text-slate-300">
                Please select a user for starting conversation
              </h2>
          }

        </div>
        <div className="basis-1/4 bg-[#472DA6] py-4">

          <h3 className="text-3xl font-bold text-center">Users</h3>
          <div className="mt-2 text-slate-800 font-medium">

            {
              users.map((user: any) => {

                if (user._id == userId) return

                let isUserOnline = onlineUsers.includes(user._id)
                let isUserSelected = user._id == selectedUser?._id
                return (
                  <div className={`${isUserOnline ? "text-slate-800 cursor-pointer" : "text-slate-500 italic"} ${isUserSelected ? "border-[#BCA9FF] border-2 bg-[#d2c6ff]" : "bg-[#BCA9FF]"} flex items-center gap-x-2 ps-4 mt-1.5`}
                    onClick={() => isUserOnline ? setSelectedUser(user) : null}>
                    <FaUserCircle />
                    <span>{user.username} ({isUserOnline ? "online" : "offline"})</span>
                  </div>)
              }
              )
            }

          </div>

        </div>

      </div>
    </div>
  )
}

export default Chat