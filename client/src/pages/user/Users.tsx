import React from 'react'
import useFetchAllUsers from '../../hooks/userFetch/useFetchAllUsers'

import userAvatar from "../../assets/user-avatar.jpg"
import { Link } from 'react-router-dom'

const Users: React.FC = () => {

  const { data, loading, error } = useFetchAllUsers()

  return (

    <div className="relative flex flex-col gap-y-6 justify-center items-center bg-blur-ellipse-small bg-[center_top_-1rem] bg-[length:200px] bg-no-repeat">
      <div>
        <h1 className="text-5xl font-bold">Users</h1>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="w-full flex items-center gap-x-2">
          <div>
            <h2>Filter</h2>
          </div>
          <div className="flex-1">
            <input type="text" className="w-full p-2 bg-[#472DA6] rounded" />
          </div>
          <button className="p-2 bg-[#472DA6] rounded">Find</button>
        </div>
        <div className="w-full mt-2 grid grid-cols-4 gap-4">
          {
            data && data.map(user =>
              <div className="w-64 h-auto pt-6 pb-7 px-2 rounded bg-gradient-to-t from-[#0D0D0D] to-[#472DA6] shadow shadow-[#472DA6]">
                <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden p-2 border border-[#cccccc]">
                  <img src={user.profilePhoto ? `${process.env.API_URL}/${user.profilePhoto}` : userAvatar} width="100%" height="auto" className="scale-125" />
                  <div className="absolute bottom-0 left-0 right-0 text-center bg-[#0D0D0D] border-t border-[#000000] bg-opacity-80 h-8">
                    <span className="font-semibold">{user.username}</span>
                  </div>
                </div>
                <div className="mt-3 mb-0.5">
                  <p className="text-center">
                    {
                      !user.name && !user.surname
                        ? <span className="text-[#acacac]">No Information</span>
                        :
                        `${user.name && user.name} ${user.surname && user.surname}`
                    }
                  </p>
                </div>
                <div className="w-4/5 mx-auto">
                  <Link to={`/user/${user.username}`} className="block w-full py-0.5 text-center text-xl font-bold border border-[#0D0D0D] bg-[#F2D541] rounded-full [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#0D0D0D] relative">
                    View
                    <img src={""} className="absolute w-20 h-auto -top-5 -right-8" />
                  </Link>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Users