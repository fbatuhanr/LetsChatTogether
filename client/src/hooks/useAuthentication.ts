import { useAppDispatch } from '../redux/hooks'
import { toast } from 'react-toastify'
import { setAccessToken, clearAccessToken } from '../redux/features/authSlice'
import axios from 'axios'
import useAxios from './useAxios'

const useAuthentication = () => {

    const dispatch = useAppDispatch()
    const axiosInstance = useAxios()

    const loginCall = (username: string, password: string) => {

        return toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const response = await axiosInstance.post(`${process.env.USER_API_URL}/login`, {
                        username,
                        password
                    })

                    if (response.status === 200) {
                        dispatch(setAccessToken(response.data.accessToken));
                        resolve(response.data.message);
                    }
                    else {
                        reject(response.data.message || 'Unknown error');
                    }

                } catch (error: unknown) {
                    
                    if (axios.isAxiosError(error) && error.response) {
                        reject(error.response.data?.message || 'Request failed')
                    }
                    else {
                        reject('An unexpected error occurred')
                    }
                }
            }
            ),
            {
                pending: 'Information is being checked...',
                success: { render({ data }) { return `${data}` } },
                error: { render({ data }) { return typeof data === 'string' ? data : 'Login failed!' } }
            }
        )
    }

    const signupCall = (username: string, email: string, password: string) => {

        return toast.promise(
            new Promise((resolve, reject) =>
                axiosInstance.post(`${process.env.USER_API_URL}/sign-up`, {
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

    const logoutCall = async () => {

        await axiosInstance.post(`${process.env.USER_API_URL}/logout`)
        dispatch(clearAccessToken());
    }

    return { loginCall, signupCall, logoutCall }
}

export default useAuthentication