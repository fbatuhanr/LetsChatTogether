import { useState } from 'react';
import useAxios from '../useAxios';
import axios from 'axios';

const useFriendRequest = () => {

    const axiosInstance = useAxios();
    const [loading, setLoading] = useState(true);

    const getAllFriendRequestsForUser = async (userId: string) => {

        try {
            const response = await axiosInstance.get(`${process.env.API_URL}/friend-request/incoming/${userId}`)

            console.log(response.data);
            if (response.status === 200)
                return response.data

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data && typeof error.response.data.message === 'string') {
                    console.log(error.response.data.message);
                } else {
                    console.error('Request failed!')
                }
            } else {
                console.error('An unexpected error occurred!')
            }
        } finally {
            setLoading(false);
        }
    }

    const getFriendRequest = async (senderId: string, receiverId: string) => {

        try {
            const response = await axiosInstance.get(`${process.env.API_URL}/friend-request/status`, {
                params: { senderId, receiverId }
            });

            console.log(response.data);
            if (response.status === 200)
                return response.data

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data && typeof error.response.data.message === 'string') {
                    console.log(error.response.data.message);
                } else {
                    console.error('Request failed!')
                }
            } else {
                console.error('An unexpected error occurred!')
            }
        } finally {
            setLoading(false);
        }
    }

    const sendFriendRequest = (senderId: string, receiverId: string) => {
        
        setLoading(true)
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axiosInstance.post(`${process.env.API_URL}/friend-request/send`, {
                    senderId,
                    receiverId
                });

                if (response.status === 201) {
                    resolve(response.data.message)
                } else {
                    reject(response.data.message)
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response && error.response.data && typeof error.response.data.message === 'string') {
                        reject(error.response.data.message);
                    } else {
                        reject('Request failed!')
                    }
                } else {
                    reject('An unexpected error occurred!')
                }
            }
        })
    };

    const cancelFriendRequest = (senderId: string, receiverId: string) => {

        setLoading(true)
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axiosInstance.delete(`${process.env.API_URL}/friend-request/cancel`, {
                    data: { senderId, receiverId }
                });

                if (response.status === 200) {
                    resolve(response.data.message)
                } else {
                    reject(response.data.message)
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response && error.response.data && typeof error.response.data.message === 'string') {
                        reject(error.response.data.message);
                    } else {
                        reject('Request failed!')
                    }
                } else {
                    reject('An unexpected error occurred!')
                }
            }
        })
    }

    // Arkadaşlığı kaldırır
    const removeFriend = async (userId: string, friendId: string) => {
        try {
            setLoading(true);
            const response = await axiosInstance.delete(`${process.env.API_URL}/friend/remove`, {
                data: { userId, friendId }
            });
            return response.data;
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false);
        }
    };

    return {
        getAllFriendRequestsForUser,
        getFriendRequest,
        sendFriendRequest,
        cancelFriendRequest,
        removeFriend,
        loading
    };
};

export default useFriendRequest;