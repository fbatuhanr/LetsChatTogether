import { NavLink, Outlet } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import { IoSettings } from 'react-icons/io5'

export const Layout = () => {

    return (
        <div className="py-8 flex flex-col gap-y-6 justify-center items-center bg-blur-ellipse-small bg-[center_top_-1rem] bg-[length:200px] bg-no-repeat">
            <div>
                <h1 className="text-5xl font-bold">Account</h1>
            </div>
            <div className="relative w-full max-w-3xl min-h-[400px] rounded bg-gradient-to-br from-[#0D0D0D] to-[#472DA6] border-[#472DA6] border-2">

                <nav className="w-full bg-[#29156C]">
                    <ul className="flex justify-around h-full text-xl [&>li]:px-5 [&>li]:py-4 text-[#B8B8B8] [&_a:hover]:text-white  [&_a.active]:text-white font-outfit font-bold">
                        <li className="rounded-tl-xl">
                            <NavLink to="/account/profile" className="flex justify-center items-center gap-x-1.5">
                                <span><FaUser className="text-lg" /></span>
                                <span>Profile</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/account/settings" className="flex justify-center items-center gap-x-1.5">
                                <span><IoSettings className="text-lg" /></span>
                                <span>Settings</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                {/* <div className="absolute -top-14 left-0">
                    <img src={SecureImg} className="w-28" />
                </div> */}

                <div className="w-3/4 mx-auto my-12 px-4 ">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout