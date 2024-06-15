import React, { useState } from 'react'
import { useAppDispatch } from '../redux/hooks';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setUser } from '../redux/features/UserSlice';

const useAuthentication = () => {

    const dispatch = useAppDispatch();

    const loginCall = async (username: string, password: string) => {

        toast.promise(
            new Promise((resolve, reject) =>

                axios.post(`${process.env.USER_API_URL}/login`, {
                    username,
                    password
                })
                    .then((response) => {
                        console.log(response.data);

                        const { message } = response.data
                        if (message) {
                            toast.error(message)
                            reject()
                            return
                        }

                        const { token, id, username } = response.data
                        dispatch(setUser({ token, id, username }));

                        resolve(true)
                    })
                    .catch((error) => {
                        console.log(error)
                        toast.error('Request error!')
                        reject()
                    })
            ),
            {
                pending: 'Information is being checked...',
                success: 'Login successful!',
                error: 'Login failed!'
            }
        )
    }

    const signupCall = async (username: string, email: string, password: string) => {

        return toast.promise(
            new Promise((resolve, reject) =>
                axios.post(`${process.env.USER_API_URL}/sign-up`, {
                    username,
                    email,
                    password
                })
                    .then((response) => {
                        console.log(response.data);

                        const { message } = response.data
                        if (message) {
                            toast.error(message)
                            reject()
                            return
                        }

                        /*const { token, id, username } = response.data
                        dispatch(setUser({ token, id, username }));*/
                        resolve(true)
                    })
                    .catch((error) => {
                        console.log(error)
                        toast.error('Request error!')
                        reject()
                    })
            ),
            {
                pending: 'Information is being checked...',
                success: 'Sign up successful!',
                error: 'Sign up failed!'
            }
        )
    }

    return { loginCall, signupCall }
}

export default useAuthentication