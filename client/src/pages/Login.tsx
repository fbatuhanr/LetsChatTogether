import { useState } from "react"
import HumanImg3 from "../assets/human-3.png"
import { toast } from "react-toastify"

const Login: React.FC = () => {

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleSubmit = () => {

        if(!username || !password){

            if(!username && !password)
                toast.warn('Enter a valid username & password!')
            else if(!username)
                toast.warn('Enter a valid username!')
            else if(!password)
                toast.warn('Enter a valid password!')

            return
        }

    }
    return (
        <div className="py-6 flex flex-col gap-y-6 justify-center items-center">
            <div>
                <h1 className="text-5xl font-bold">Login</h1>
            </div>
            <div className="relative w-full max-w-3xl h-[400px] px-8 rounded-xl bg-gradient-to-br from-[#4F22F2] to-[#20183F]">

                <div className="ps-24 w-3/4 flex flex-col gap-y-3 h-full justify-center">
                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="username" className="text-2xl font-semibold ps-2">Username</label>
                        <input type="text" className="bg-[#0D0D0D] rounded-2xl px-6 py-4" placeholder="type here..."
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="password" className="text-2xl font-semibold ps-2">Password</label>
                        <input type="password" className="bg-[#0D0D0D] rounded-2xl px-6 py-4" placeholder="type here..."
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>
                    <button type="button" className="mt-4 bg-[#DBBA12] rounded-2xl py-3 text-2xl [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#0D0D0D]"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
                <div className="absolute top-4 -right-20 -mr-0.5">
                    <img src={HumanImg3} className="w-56" />
                </div>
            </div>
        </div>
    )
}

export default Login