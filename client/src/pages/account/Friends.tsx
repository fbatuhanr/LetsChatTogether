import { useEffect } from 'react'
import useFriendship from '../../hooks/api/useFriendship'
import { useDecodedToken } from '../../hooks/useDecodedToken'

import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { FaEye, FaTrash } from 'react-icons/fa';
import { IoIosChatboxes } from 'react-icons/io';
import { toast } from 'react-toastify';

const Friends = () => {
    
    const decodedToken = useDecodedToken()

    const {
        friends,
        incomingRequests,
        outgoingRequests,

        getFriends,
        getIncomingRequests,
        getOutgoingRequests,

        removeFriend,
        acceptRequest,
        cancelRequest
    } = useFriendship();

    useEffect(() => {
        getFriends(decodedToken.userId)
        getIncomingRequests(decodedToken.userId)
        getOutgoingRequests(decodedToken.userId)
    }, []);

    const handleAcceptRequest = async (senderId: string, receiverId: string) => {

        await toast.promise(acceptRequest(senderId, receiverId), {
            pending: 'Request sending...',
            success: { render: ({ data }) => `${data}` },
            error: { render: ({ data }) => `${data}` }
        });

        getIncomingRequests(decodedToken.userId)
        getFriends(decodedToken.userId)
    }
    const handleCancelSentRequest = async (senderId: string, receiverId: string) => {

        await toast.promise(cancelRequest(senderId, receiverId), {
            pending: 'Request sending...',
            success: { render: ({ data }) => `${data}` },
            error: { render: ({ data }) => `${data}` }
        });

        getOutgoingRequests(decodedToken.userId)
    }
    const handleRemoveFriend = async(userId: string, friendId: string) => {

        await toast.promise(removeFriend(userId, friendId), {
            pending: 'Request sending...',
            success: { render: ({ data }) => `${data}` },
            error: { render: ({ data }) => `${data}` }
        });

        getFriends(decodedToken.userId)
    }

    return (
        <div className="w-full grid grid-cols-3 gap-4">
            <div>
                <h3 className="border-b mb-4 px-2 text-xl">Active Friends</h3>
                <div className="px-1">
                    <ul>
                        {
                            friends && friends.map((friend: any, index: number) =>
                                <li key={index} className="flex justify-between items-center text-xl my-0.5 ps-4 pe-2 py-0.5 bg-black bg-opacity-20 rounded-xl">
                                    <Link to={`/user/${friend.username}`} className="flex items-center gap-x-1">
                                        {friend.username}
                                        <FaEye className="text-lg text-white mt-0.5" />
                                    </Link>
                                    <div className="flex items-center gap-x-1.5">
                                        <button><IoIosChatboxes className="text-xl text-white" /></button>
                                        <button onClick={() => handleRemoveFriend(decodedToken.userId, friend._id)}>
                                            <FaTrash className="text-sm text-red-500" />
                                        </button>
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
            <div>
                <h3 className="border-b mb-4 px-2 text-xl">Received Requests</h3>
                <div className="px-1">
                    <ul>
                        {
                            incomingRequests && incomingRequests.map((request: any, index: number) =>
                                <li key={index} className="flex justify-between items-center text-xl ps-4 pe-2 py-0.5 bg-black bg-opacity-20 rounded-xl">
                                    <Link to={`/user/${request.sender.username}`}>
                                        {request.sender.username}
                                    </Link>
                                    <div className="flex items-center gap-x-1.5">
                                        <button onClick={() => handleAcceptRequest(request.sender._id, decodedToken.userId)}>
                                            <FaCircleCheck className="text-2xl text-[#0dd112]" />
                                        </button>
                                        <button>
                                            <FaCircleXmark className="text-xl text-[#f33825]" />
                                        </button>
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
                        {
                            outgoingRequests && outgoingRequests.map((request: any, index: number) =>
                                <li key={index} className="flex justify-between items-center text-xl my-0.5 ps-4 pe-2 py-0.5 bg-black bg-opacity-20 rounded-xl">
                                    <Link to={`/user/${request.receiver.username}`}>
                                        {request.receiver.username}
                                    </Link>
                                    <div className="flex items-center gap-x-1.5">
                                        <button onClick={() => handleCancelSentRequest(decodedToken.userId, request.receiver._id)}><FaCircleXmark className="text-2xl text-[#f33825]" /></button>
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Friends