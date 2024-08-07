import React, { useEffect, useState } from 'react';
import useFriendRequest from '../hooks/api/useFriendRequest'
import MessageImg from "../assets/message.png"
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';

interface FriendRequestButtonProps {
    senderId: string;
    receiverId: string;
}
enum FriendRequestStatus {
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected',
}

const FriendRequestButton: React.FC<FriendRequestButtonProps> = ({ senderId, receiverId }) => {

    const {
        getFriendRequest, sendFriendRequest, cancelFriendRequest, removeFriend,
        loading
    } = useFriendRequest();

    const [status, setStatus] = useState<FriendRequestStatus | null>(null);

    const fetchStatus = async () => {
        try {
            const request = await getFriendRequest(senderId, receiverId) as FriendRequestStatus
            setStatus(request)
        }
        catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleClick = async () => {
        let methodToCall;

        if (status === FriendRequestStatus.Pending) {
            methodToCall = () => cancelFriendRequest(senderId, receiverId);
        } else if (status === FriendRequestStatus.Accepted) {
            methodToCall = () => removeFriend(senderId, receiverId);
        } else if (status === FriendRequestStatus.Rejected || !status) {
            methodToCall = () => sendFriendRequest(senderId, receiverId);
        } else {
            console.error('Unknown status');
            return;
        }

        try {
            await toast.promise(methodToCall(), {
                pending: 'Request sending...',
                success: { render: ({ data }) => `${data}` },
                error: { render: ({ data }) => `${data}` }
            });
            fetchStatus();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getButtonText = () => {

        if (status === FriendRequestStatus.Pending) {
            return 'Cancel Request';
        } else if (status === FriendRequestStatus.Accepted) {
            return 'Remove Friend';
        } else if (status === FriendRequestStatus.Rejected || !status) {
            return 'Friend Request';
        }
    }

    const getButtonClasses = () => {

        if (status === FriendRequestStatus.Pending) {
            return 'bg-yellow-600 text-gray-200';
        } else if (status === FriendRequestStatus.Accepted) {
            return 'bg-red-500';
        } else if (status === FriendRequestStatus.Rejected || !status) {
            return 'bg-yellow-400';
        }
    }

    if(loading) return <LoadingSpinner />
    return (
        <div className="text-center">
            <button
                className={`ps-8 pe-12 py-2 text-xl font-bold rounded-2xl [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#251562] shadow-sm relative ${getButtonClasses()}`}
                onClick={handleClick}
            >
                {getButtonText()}
                <img src={MessageImg} className="absolute w-16 h-auto -top-4 -right-6" alt="Message Icon" />
            </button>
        </div>
    );
};

export default FriendRequestButton