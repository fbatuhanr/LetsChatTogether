import { useAppDispatch } from '../redux/hooks'
import { toast } from 'react-toastify'
import { setAccessToken, clearAccessToken } from '../redux/features/authSlice'
import useAxios from './useAxios'

const useAuthentication = () => {

    const axiosInstance = useAxios()

    const dispatch = useAppDispatch()

    const loginCall = async (username: string, password: string) => {

        toast.promise(
            new Promise((resolve, reject) =>

                axiosInstance.post(`${process.env.USER_API_URL}/login`, {
                    username,
                    password
                })
                    .then((response) => {
                        console.log(response);
                        
                        if (response.status === 404 || response.status === 500) {
                            toast.error(response.data.message)
                            reject()
                            return
                        }
                        if (response.status === 200) {
                            dispatch(setAccessToken(response.data.accessToken));
                            toast.success(response.data.message)
                            resolve(true)
                        }
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