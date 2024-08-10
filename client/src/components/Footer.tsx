import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import { useDecodedToken } from "../hooks/useDecodedToken"

const Footer: React.FC = () => {

    const decodedToken = useDecodedToken()

    const handleAboutButton = () => {

        Swal.fire(
            {
                title: "Let's Chat Together",
                icon: "info",
                html: `<b>Project Source Code:</b> <br/> <a href="https://github.com/fbatuhanr/lets-chat-together" target="_blank">github.com/fbatuhanr/lets-chat-together</a>`,
            }
        )
    }

    return (
        <footer className="mt-14 lg:mt-28 bg-gradient-to-t from-[#6841F2] to-[#0D0D0D1a] min-h-[200px]">
            <div className="max-w-4xl px-12 mx-auto">
                <nav className="pt-16 pb-8 flex flex-col gap-y-12 md:flex-row md:gap-x-8 justify-between">
                    <div>
                        <h6 className="mb-6 md:mb-8 text-center md:text-start text-3xl md:text-2xl font-semibold">
                            <Link to="/">
                                Let's Chat Together
                            </Link>
                        </h6>
                        <div className="grid grid-cols-2 grid-rows-2 md:text-start text-center gap-y-4 justify-center md:justify-start">
                            {
                                decodedToken.userId ?
                                    <>
                                        <Link to={`/user/${decodedToken.username}`} className="text-xl font-bold">Profile</Link>
                                        <Link to="/account/friends" className="text-xl font-bold">Friends</Link>
                                        <Link to="/account/settings" className="text-xl font-bold">Settings</Link>
                                    </>
                                    :
                                    <>
                                        <Link to="/login" className="text-xl font-bold">Login</Link>
                                        <Link to="/signup" className="text-xl font-bold">Sign up</Link>
                                        <Link to="/users" className="text-xl font-bold">Users</Link>
                                    </>
                            }
                            <button className="text-xl font-bold md:text-start text-center" onClick={handleAboutButton}>About</button>
                        </div>
                    </div>
                    <div>
                        <h6 className="mb-4 md:mb-10 text-center md:text-end text-2xl md:text-2xl font-semibold">Join Our Newsletter</h6>

                        <div className="mb-2 mr-2.5">
                            <ul className="w-full flex justify-center md:justify-end gap-x-2 text-2xl">
                                <li><a href="https://www.linkedin.com/in/-batuhan/" target="_blank"><FaFacebook /></a></li>
                                <li><a href="https://www.linkedin.com/in/-batuhan/" target="_blank"><FaTwitter /></a></li>
                                <li><a href="https://www.linkedin.com/in/-batuhan/" target="_blank"><FaLinkedin /></a></li>
                                <li><a href="https://www.linkedin.com/in/-batuhan/" target="_blank"><FaInstagram /></a></li>
                            </ul>
                        </div>
                        <div className="relative">
                            <input type="text" className="w-full ps-8 pe-24 py-2 rounded-full bg-[#0D0D0D] text-[#BBBBBB]" placeholder="write your email..." />
                            <button className="absolute right-0 px-4 py-2 rounded-full bg-[#F2D541]">Submit</button>
                        </div>
                    </div>
                </nav>
            </div>
            <div className="text-center pb-2">
                <a href="https://github.com/fbatuhanr" target="_blank">
                    2024 All Rights Reserved. Developed & Designed by <u>fbatuhanr</u>
                </a>
            </div>
        </footer>
    )
}

export default Footer