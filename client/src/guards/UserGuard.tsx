import { useAppSelector } from "../redux/hooks";
import { Navigate } from "react-router-dom";

export const UserGuard = ({ children }: { children: React.ReactNode }) => {

    const auth = useAppSelector((state) => state.auth)

    if (!auth.accessToken) {
        return <Navigate to="/login" />
    }

    return <>{children}</>
}
export default UserGuard