import React from 'react'
import { FaUserCircle } from 'react-icons/fa'

const Chat = () => {
  return (

    <div className="py-8 flex flex-col gap-y-6 justify-center items-center bg-blur-ellipse-small bg-[center_top_-1rem] bg-[length:200px] bg-no-repeat">
    <div>
        <h1 className="text-5xl font-bold">Chat</h1>
    </div>
    <div className="flex w-full max-w-3xl min-h-[400px] rounded-xl bg-gradient-to-br from-[#0D0D0D] to-[#472DA6] border-[#472DA6] border-2">

      <div className="basis-3/4 p-12"> 

        <div className="border-2 border-[#6841F2] w-full h-full rounded-  xl">
        a
        </div>
        <div className="border-2 border-[#6841F2]">
        b
        </div>

      </div>
      <div className="basis-1/4 bg-[#472DA6] py-4">

        <h3 className="text-3xl font-bold text-center">Users</h3>
        <div className="mt-2 bg-[#BCA9FF] text-black font-semibold cursor-pointer">

          <div className="flex items-center gap-x-2 ps-4">
            <FaUserCircle/>
            <span>batuhan</span>
          </div>

        </div>

      </div>

    </div>
</div>
  )
}

export default Chat