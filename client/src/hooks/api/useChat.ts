import { useState } from 'react'
import useAxios from '../useAxios'
import axios from 'axios'

const useChat = () => {

    const axiosInstance = useAxios();

    const [chat, setChat] = useState()

    const getChats = async (userId: string, includeUser: boolean = false) => {
        try {
            const response = await axiosInstance.get(`${process.env.API_URL}/friend/${userId}`)
            if (response.status === 200) {
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


    const deleteChat = (userId: string, friendId: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axiosInstance.delete(`${process.env.API_URL}/friend/${userId}/${friendId}`);
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
        deleteChat
    };
};

export default useChat