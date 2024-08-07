import { useAppDispatch } from '../../redux/hooks'
import { setAccessToken, clearAccessToken } from '../../redux/features/authSlice'
import axios from 'axios'
import useAxios from '../useAxios'

const useAuthentication = () => {
    const dispatch = useAppDispatch();
    const axiosInstance = useAxios();

    const loginCall = (username: string, password: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axiosInstance.post(`${process.env.USER_API_URL}/login`, {
                    username,
                    password
                });

                if (response.status === 200) {
                    dispatch(setAccessToken(response.data.accessToken))
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
        });
    };

    const signupCall = (username: string, email: string, password: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axiosInstance.post(`${process.env.USER_API_URL}/sign-up`, {
                    username,
                    email,
                    password
                });

                if (response.status === 201) {
                    resolve(response.data.message);
                } else {
                    reject(response.data.message);
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
        });
    }


    const logoutCall = async () => {
        await axiosInstance.post(`${process.env.USER_API_URL}/logout`);
        dispatch(clearAccessToken());
    };

    return { loginCall, signupCall, logoutCall };
};

export default useAuthentication;
