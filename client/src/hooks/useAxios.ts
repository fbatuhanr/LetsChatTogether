import axios from "axios";
import { useAppStore, useAppDispatch } from "../redux/hooks"
import { clearAccessToken, setAccessToken } from "../redux/features/authSlice"


const useAxios = () => {

    const store = useAppStore()
    const dispatch = useAppDispatch()

    const axiosInstance = axios.create({
        baseURL: process.env.API_URL,
        withCredentials: true // Required to send cookies
    })

    axiosInstance.interceptors.request.use(
        (config) => {
            const state = store.getState()
            const accessToken = state.auth.accessToken

            // console.log(accessToken)

            if (accessToken) {
                config.headers["Authorization"] = `Bearer ${accessToken}`
            }

            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    axiosInstance.interceptors.response.use(
        (response) => {
            return response
        },
        async (error) => {
            const originalRequest = error.config
            // console.log(error)
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true

                try {
                    const { data } = await axiosInstance.post(`${process.env.AUTH_API_URL}/refresh-token`)
                    dispatch(setAccessToken(data.accessToken))
                    axios.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`

                    return axiosInstance(originalRequest)
                } catch (err) {
                    dispatch(clearAccessToken());
                    return Promise.reject(err)
                }
            }

            return Promise.reject(error)
        }
    )

    return axiosInstance
}

export default useAxios