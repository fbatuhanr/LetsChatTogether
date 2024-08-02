import { Link, useNavigate } from "react-router-dom"
import useAuthentication from "../hooks/useAuthentication"
import { useDecodedToken } from "../hooks/useDecodedToken"

const Header: React.FC = () => {

    const decodedToken = useDecodedToken()
    const navigate = useNavigate()
    const { logoutCall } = useAuthentication()

    const handleLogout = async () => {
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
                        decodedToken?.username ?
                            <>
                                <div className="text-2xl font-semibold">
                                    <Link to="/chat">Chat</Link>
                                </div>
                                <div className="text-2xl font-semibold">
                                    <Link to={`/user/${decodedToken.username}`} className="underline">
                                        {decodedToken.username}
                                    </Link>
                                </div>
                                <div className="text-2xl font-semibold">
                                    <Link to="/account/profile">Account</Link>
                                </div>
                                <div className="relative ml-4">
                                    <span className="text-[0.65rem] text-[#cccccc] absolute -top-2 -right-2">({decodedToken.username})</span>
                                    <button type="button" onClick={handleLogout} className="text-2xl font-semibold text-[#F52525]">Logout</button>
                                </div>
                            </>
                            :
                            <>
                                <div className="text-2xl font-semibold">
                                    <Link to="/login">Login</Link>
                                </div>
                                <div className="text-2xl font-semibold">
                                    <Link to="/signup">Sign up</Link>
                                </div>
                            </>
                    }
                </nav>
            </div>
        </header>
    )
}

export default Header