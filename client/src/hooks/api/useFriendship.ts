import { useState } from 'react';
import useAxios from '../useAxios';
import axios from 'axios';
import { FriendProps } from '../../types/User.types';

export enum RequestStatus {
    None = 'none',
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected',
}

export interface FriendRequestStatus {
    isSender?: boolean,
    status: RequestStatus
}
const useFriendship = (currentUserId: string) => {

    const axiosInstance = useAxios();

    const [friends, setFriends] = useState<Array<FriendProps> | null>([])
    const [incomingRequests, setIncomingRequests] = useState<[] | null>(null)
    const [outgoingRequests, setOutgoingRequests] = useState<[] | null>(null)
    const [requestStatusBetweenUsers, setRequestStatusBetweenUsers] = useState<FriendRequestStatus | null>(null)

    const getFriends = async (includeUser: boolean = false) => {
        try {
            const response = await axiosInstance.get(`${process.env.API_URL}/friend/${currentUserId}`)
            if (response.status === 200) {
                console.log(response.data)
                if (!includeUser) {
                    setFriends(response.data.friends)
                }
                else {
                    const friendsWithUser = [
                        {
                            _id: response.data._id,
                            username: response.data.username,
                            profilePhoto: response.data.profilePhoto ? response.data.profilePhoto : null
                        },
                        ...response.data.friends
                    ];
                    setFriends(friendsWithUser)
                }
            }
            else {
                console.error('Unexpected response status!')
            }

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setFriends(null)
                console.log(error.response.data?.message || 'Request failed!')
            }
            else {
                console.error('An unexpected error occurred!')
            }
        }
    }
    
    const getIncomingRequests = async () => {
        try {
            const response = await axiosInstance.get(`${process.env.API_URL}/friend-request/incoming/${currentUserId}`)
            if (response.status === 200) {
                setIncomingRequests(response.data)
            }
            else {
                console.error('Unexpected response status!')
            }

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setIncomingRequests(null)
                console.log(error.response.data?.message || 'Request failed!')
            }
            else {
                console.error('An unexpected error occurred!')
            }
        }
    }
    const getOutgoingRequests = async () => {
        try {
            const response = await axiosInstance.get(`${process.env.API_URL}/friend-request/outgoing/${currentUserId}`)
            if (response.status === 200) {
                setOutgoingRequests(response.data)
            }
            else {
                console.error('Unexpected response status!')
            }

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setOutgoingRequests(null)
                console.log(error.response.data?.message || 'Request failed!')
            }
            else {
                console.error('An unexpected error occurred!')
            }
        }
    }
    const getRequestStatusBetweenUsers = async (targetUserId: string) => {
        try {
            const response = await axiosInstance.get(`${process.env.API_URL}/friend-request/status`, {
                params: { 
                    senderId: currentUserId, 
                    receiverId: targetUserId 
                }
            });
            if (response.status === 200) {
                setRequestStatusBetweenUsers(response.data)
            }
            else {
                console.error('Unexpected response status!')
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setRequestStatusBetweenUsers({ status: RequestStatus.None })
                console.log(error.response.data?.message || 'Request failed!')
            }
            else {
                console.error('An unexpected error occurred!')
            }
        }
    }


    const removeFriend = (targetUserId: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axiosInstance.delete(`${process.env.API_URL}/friend/${currentUserId}/${targetUserId}`);
                if (response.status === 200)
                    resolve(response.data.message)
                else
                    reject(response.data.message)

            } catch (error) {
                if (axios.isAxiosError(error) && error.response)
                    reject(error.response.data?.message || 'Request failed!')
                else
                    reject('An unexpected error occurred!')

            }
        })
    }
    const sendRequest = (targetUserId: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axiosInstance.post(`${process.env.API_URL}/friend-request/send`, {
                    senderId: currentUserId,
                    receiverId: targetUserId
                });
                if (response.status === 201)
                    resolve(response.data.message)
                else
                    reject(response.data.message)

            } catch (error) {
                if (axios.isAxiosError(error) && error.response)
                    reject(error.response.data?.message || 'Request failed!')
                else
                    reject('An unexpected error occurred!')

            }
        })
    }
    const acceptRequest = async (targetUserId: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axiosInstance.put(`${process.env.API_URL}/friend-request/accept`, {
                    senderId: currentUserId, 
                    receiverId: targetUserId
                })
                if (response.status === 201)
                    resolve(response.data.message)
                else
                    reject(response.data.message)

            } catch (error) {
                if (axios.isAxiosError(error) && error.response)
                    reject(error.response.data?.message || 'Request failed!')
                else
                    reject('An unexpected error occurred!')

            }
        })
    }
    const cancelRequest = (targetUserId: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axiosInstance.delete(`${process.env.API_URL}/friend-request/cancel`, {
                    data: { 
                        senderId: currentUserId, 
                        receiverId: targetUserId 
                    }
                });
                if (response.status === 200)
                    resolve(response.data.message)
                else
                    reject(response.data.message)

            } catch (error) {
                if (axios.isAxiosError(error) && error.response)
                    reject(error.response.data?.message || 'Request failed!')
                else
                    reject('An unexpected error occurred!')

            }
        })
    }

    return {
        friends,

        incomingRequests,
        outgoingRequests,
        requestStatusBetweenUsers,

        getFriends,
        getIncomingRequests,
        getOutgoingRequests,
        getRequestStatusBetweenUsers,

        removeFriend,
        sendRequest,
        acceptRequest,
        cancelRequest
    };
};

export default useFriendship;