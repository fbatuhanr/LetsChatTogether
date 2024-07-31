import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { setAccessToken, clearAccessToken } from "../redux/features/authSlice"
import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import useAxios from "../hooks/useAxios"
import LoadingSpinner from "../components/LoadingSpinner"

type WithAuthCheckWrappedComponentProps = {
    children: React.ReactNode;
}
const withAuthCheck = (
    WrappedComponent: React.FC<WithAuthCheckWrappedComponentProps>,
    shouldRedirectAuthenticated: boolean,
    redirectPath: string
) => {
    return (props: any) => {
        const axiosInstance = useAxios()
        const auth = useAppSelector((state) => state.auth)
        const dispatch = useAppDispatch()
        const [isLoading, setIsLoading] = useState(true)
        const [isAuthenticated, setIsAuthenticated] = useState(false)

        useEffect(() => {
            const checkTokenValidity = async () => {
                if (auth.accessToken) {
                    try {
                        const decodedJwt: any = jwtDecode(auth.accessToken)
                        const isTokenExpired = decodedJwt.exp * 1000 < Date.now()

                        if (isTokenExpired) {
                            console.log("Token süresi geçmiş, yenileniyor...")
                            const response = await axiosInstance.post(`${process.env.AUTH_API_URL}/refresh-token`)
                            if (response.status === 200) {
                                dispatch(setAccessToken(response.data.accessToken))
                                setIsAuthenticated(true)
                            } else {
                                console.log("Yeni token alınamadı")
                                throw new Error("Yeni token alınamadı")
                            }
                        } else {
                            console.log("Token süresi geçmemiş")
                            setIsAuthenticated(true)
                        }
                    } catch (err) {
                        console.error("Hata: ", err)
                        dispatch(clearAccessToken())
                        setIsAuthenticated(false)
                    }
                } else {
                    setIsAuthenticated(false)
                }

                setIsLoading(false)
            };

            checkTokenValidity();
        }, [auth.accessToken, axiosInstance, dispatch]);

        if (isLoading) return <LoadingSpinner />
        if (isAuthenticated === shouldRedirectAuthenticated) return <Navigate to={redirectPath} />

        return <WrappedComponent {...props} />
    }
}

export default withAuthCheck;
