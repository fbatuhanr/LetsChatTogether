import { useAppSelector } from "../redux/hooks";
import { Navigate } from "react-router-dom";

const GuestGuard = ({ children }: { children: React.ReactNode }) => {

    const user = useAppSelector((state) => state.user)

    if (user.username && user.token) {
        return <Navigate to="/" />
    }

    return <>{children}</>;
};

export default GuestGuard;