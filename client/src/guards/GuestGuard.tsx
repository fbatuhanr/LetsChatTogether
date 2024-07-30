import { useAppSelector } from "../redux/hooks";
import { Navigate } from "react-router-dom";

export const GuestGuard = ({ children }: { children: React.ReactNode }) => {

    const auth = useAppSelector((state) => state.auth)

    if (auth.accessToken) {
        return <Navigate to="/" />
    }

    return <>{children}</>
}
export default GuestGuard