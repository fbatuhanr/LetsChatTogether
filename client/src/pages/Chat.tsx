import { useEffect, useMemo, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'

import io from 'socket.io-client';
import Message from '../components/Message';
import axios from 'axios';
import { useAppSelector } from '../redux/hooks';

const Chat = () => {

  const user = useAppSelector((state) => state.user)
  const userId = user ? user.id: null

  const socket = useMemo(() =>
    io(`${process.env.API_URL}`, {
      extraHeaders: { userid: userId }
    }),[]);

    const [msg,setMsg] = useState('');
    const [users,setUsers] = useState([]);
    const [selectedUser,setSelecteduser] = useState();
    const [chats,setChats] = useState([]);
    const [activeUsers,setActiveusers] = useState([]);

  useEffect(() => {

    const getUsers = async () => {
      axios.get(`${process.env.USER_API_URL}`)
        .then((response) => {
          console.log(response)

          const result = response.data.filter((i: any) => i._id != user.id)
          setUsers(result)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    getUsers()

    function onConnect() {
      console.log("connect");
    }
    function onDisconnect() {
      console.log("disconnect");
    }
    function onMsg(value: any) {
      console.log(value);
      setChats((chats) => [...chats, value] as any);
    }
    function onUser(value: any) {
      console.log(value);
      setActiveusers(value);
      // set active users
    }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message', onMsg);

    socket.on('USERS', onUser);
    
    return () => {
      socket.disconnect();
    };

  }, [])

  const sendMsg = () => {
    if(msg == '') return;

    let resultData = {
        "message":msg,
        "receiver":''+selectedUser._id,
        "sender":''+userId,
        "createdon": (new Date()).toISOString()
    }

    console.log(resultData)
    
    socket.emit('sendMessage', resultData);
    // setChats((chats) => [...chats,data] as any);
    setMsg('');
}

  return (

    <div className="py-8 flex flex-col gap-y-6 justify-center items-center bg-blur-ellipse-small bg-[center_top_-1rem] bg-[length:200px] bg-no-repeat">
      <div>
        <h1 className="text-5xl font-bold">Chat {user && `(${user.username})`}</h1>
      </div>
      <div className="flex w-full max-w-3xl min-h-[400px] rounded-xl bg-gradient-to-br from-[#0D0D0D] to-[#472DA6] border-[#472DA6] border-2">

        <div className="basis-3/4 p-12">

          <div className="border-2 border-[#6841F2] w-full h-full rounded-xl">
            
            {
              selectedUser ?
              selectedUser.username
              :
              "Please select a user for start conversation..."
            }

            {
             chats && chats.map(chat => <li>{chat}</li>)
            }
            
          </div>
          <div className="border-2 border-[#6841F2]">
            <input
              type="text"
              value={msg}
              className="text-black"
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={sendMsg} className="bg-teal-500">Send</button>
          </div>

        </div>
        <div className="basis-1/4 bg-[#472DA6] py-4">

          <h3 className="text-3xl font-bold text-center">Users</h3>
          <div className="mt-2 text-slate-800 font-medium">

            {
              users.map((user: any) =>
                <div onClick={() => setSelecteduser(user)} className="bg-[#BCA9FF] flex items-center cursor-pointer gap-x-2 ps-4 mt-1">
                  <FaUserCircle />
                  <span>{user.username}</span>
                </div>
              )
            }

          </div>

        </div>

      </div>
    </div>
  )
}

export default Chat