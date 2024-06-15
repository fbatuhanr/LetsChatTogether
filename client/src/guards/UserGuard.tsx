import { useAppSelector } from "../redux/hooks";
import { Navigate } from "react-router-dom";


const UserGuard = ({ children }: { children: React.ReactNode }) => {

    const user = useAppSelector((state) => state.user)

    if(!user.token || !user.username){
        return <Navigate to="/login" />
    }

    return <>{children}</>;
};

export default UserGuard;