import React, { useEffect, useState } from 'react'
import useFriendRequest from '../../hooks/api/useFriendRequest'
import { useDecodedToken } from '../../hooks/useDecodedToken'

import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Friends = () => {

    const decodedToken = useDecodedToken()

    const [friendRequest, setFriendRequests] = useState([])
    const { getAllFriendRequestsForUser } = useFriendRequest()

    useEffect(() => {

        const fetchStatus = async () => {
            try {
                const requests = await getAllFriendRequestsForUser(decodedToken.userId)
                setFriendRequests(requests)
            }
            catch (err) {
                console.log(err)
            }
        };
        fetchStatus()
    }, [])
    /* return (
         <div>
             <h2>Friends</h2>
 
             <div>
                 <h3>Friend Requests</h3>
             </div>
             {
                 friendRequest && friendRequest.map((request, index: number) =>
                     <p key={index}>{request.sender.username}</p>
                 )
             }
         </div>
     )*/
    return (
        <div className="w-full grid grid-cols-3 gap-4">
            <div>
                <h3 className="border-b mb-4 px-2 text-xl">Active Friends</h3>
                <div className="px-1">
                    <ul>
                        <li></li>
                    </ul>
                </div>
            </div>
            <div>
                <h3 className="border-b mb-4 px-2 text-xl">Received Requests</h3>
                <div className="px-1">
                    <ul>
                        {
                            friendRequest && friendRequest.map((request, index: number) =>
                                <li key={index} className="flex justify-between items-center text-xl ps-4 pe-2 py-0.5 bg-black bg-opacity-20 rounded-xl">
                                    <Link to={`/user/${request.sender.username}`}>
                                        {request.sender.username}
                                    </Link>
                                    <div className="flex items-center gap-x-1.5">
                                        <button><FaCircleCheck className="text-2xl text-[#0dd112]"/></button>
                                        <button><FaCircleXmark className="text-xl text-[#f33825]" /></button>
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
            <div>
                <h3 className="border-b mb-4 px-2 text-xl">Sent Requests</h3>
                <div className="px-1">
                    <ul>
                        <li></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Friends