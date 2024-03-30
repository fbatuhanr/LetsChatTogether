import React, { useState } from 'react'
import { useAppSelector } from '../redux/hooks'

import SecureImg from "../assets/secure.png"


const Profile = () => {

    const user = useAppSelector((state) => state.user)

    const [email, setEmail] = useState<string>("")
    const [dateOfBirth, setDateOfBirth] = useState<string>("")
    const [profilePhoto, setProfilePhoto] = useState<string>("")


    const handleSubmit = () => {

        console.log(email)
        console.log(dateOfBirth)
        console.log(profilePhoto)

    }

    return (

        <div className="py-8 flex flex-col gap-y-6 justify-center items-center bg-blur-ellipse-small bg-[center_top_-1rem] bg-[length:200px] bg-no-repeat">
            <div>
                <h1 className="text-5xl font-bold">Profile</h1>
            </div>
            <div className="relative w-full max-w-3xl min-h-[400px] px-8 pt-16 pb-12 rounded-xl bg-gradient-to-br from-[#0D0D0D] to-[#472DA6] border-[#472DA6] border-2">

                <div className="absolute -top-14 left-0">
                    <img src={SecureImg} className="w-28" />
                </div>

                <div className="w-4/5 mx-auto flex flex-col gap-y-3 h-full justify-center">

                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="username" className="text-2xl font-semibold ps-2">Username</label>
                        <input type="text" id="username" value={user.username} className="bg-[#BCA9FF] border-[#20183F] border-2 rounded-2xl px-6 py-4" readOnly disabled />
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="email" className="text-2xl font-semibold ps-2">Email</label>
                        <input type="text" id="email" className="bg-[#BCA9FF] border-[#20183F] border-2 rounded-2xl px-6 py-4" placeholder="Type here..."
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="dateofbirth" className="text-2xl font-semibold ps-2">Date of Birth</label>
                        <input type="text" id="dateofbirth" className="bg-[#BCA9FF] border-[#20183F] border-2 rounded-2xl px-6 py-4" placeholder="Type here..."
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            value={dateOfBirth}
                        />
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="profilephoto" className="text-2xl font-semibold ps-2">Profile Photo</label>
                        <input type="file" id="profilephoto" className="bg-[#BCA9FF] border-[#20183F] border-2 rounded-2xl px-6 py-4"
                            onChange={(e) => setProfilePhoto(e.target.value)}
                            value={profilePhoto}
                        />
                    </div>

                    <button type="button" className="mt-4 bg-[#DBBA12] rounded-2xl py-3 text-2xl [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#0D0D0D]"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
                <div className="absolute top-4 -right-20 -mr-0.5">
                    <img src={""} className="w-56" />
                </div>
            </div>
        </div>
    )
}

export default Profile