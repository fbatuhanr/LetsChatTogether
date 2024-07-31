import { Link, useNavigate } from "react-router-dom"
import { useAppSelector } from "../redux/hooks"
import useAuthentication from "../hooks/useAuthentication"

const Header: React.FC = () => {

    const { logoutCall } = useAuthentication()
    const navigate = useNavigate()

    const auth = useAppSelector((state) => state.auth)
    console.log(auth)

    const handleLogout = async() => {
        await logoutCall()
        navigate('/');
    }

    return (
        <header className="bg-gradient-to-b from-[#4F22F2] to-[#0D0D0D1a] h-[140px] md:h-[130px]">
            <div className="max-w-6xl px-12 mx-auto">
                <nav className="flex items-center gap-x-8 py-8">
                    <div className="flex-1 text-xl md:text-3xl font-bold">
                        <Link to="/">Let's Chat Together</Link>
                    </div>
                    {
                        !auth.accessToken ?
                            <>
                                <div className="text-2xl font-semibold">
                                    <Link to="/login">Login</Link>
                                </div>
                                <div className="text-2xl font-semibold">
                                    <Link to="/signup">Sign up</Link>
                                </div>
                            </>
                            :
                            <>
                                <div className="text-2xl font-semibold">
                                    <Link to="/chat">Chat</Link>
                                </div>
                                <div className="text-2xl font-semibold">
                                    <Link to="/account/profile">Account</Link>
                                </div>
                                <div className="relative">
                                    <span className="text-[0.65rem] text-[#cccccc] absolute -top-2 -right-2">()</span>
                                    <button type="button" onClick={handleLogout} className="text-2xl font-semibold text-[#F52525]">Logout</button>
                                </div>
                            </>
                    }
                </nav>
            </div>
        </header>
    )
}

export default Header