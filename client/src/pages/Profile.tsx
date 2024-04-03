import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../redux/hooks'

import SecureImg from "../assets/secure.png"
import axios from 'axios'

import Datepicker from "tailwind-datepicker-react"


interface IUser {
    email?: string,
    dateOfBirth?: Date,
    profilePhoto?: File | string
}

const Profile = () => {

    const user = useAppSelector((state) => state.user)
    const [data, setData] = useState<IUser>({})

    const [isDatepickerVisible, setIsDatepickerVisible] = useState<boolean>(false)

    useEffect(() => {

        axios.get(`${process.env.API_URL}/user/${user.id}`)
            .then((response) => {

                const { email, dateOfBirth, profilePhoto } = response.data
                setData({
                    email,
                    dateOfBirth,
                    profilePhoto
                })
            });

    }, [])

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        setData((prevState: IUser) => ({ ...prevState, email: event.target.value }))
    }
    const handleDateOfBirthChange = (selectedDate: Date) => {

        setData((prevState: IUser) => ({ ...prevState, dateOfBirth: selectedDate }))
    }

    const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        if (!event.target.files) return;

        const profilePhoto = event.target.files[0]
        setData((prevState: IUser) => ({ ...prevState, profilePhoto }))
    }


    const handleSubmit = () => {

        console.log(data)

        let newData = {
            email: data.email,
            dateOfBirth: data.dateOfBirth,
        } as any

        if (('File' in window && data.profilePhoto instanceof File))
            newData = { ...newData, profilePhoto: data.profilePhoto }

        const headers = { 'Content-Type': 'multipart/form-data' };
        axios.put(`${process.env.API_URL}/user/${user.id}`, newData, { headers })
            .then((response) => {
                console.log(response.data);
                window.location.reload();
            });

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
                        <input type="text" id="email" className="bg-[#BCA9FF] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-200" placeholder="Type here..."
                            onChange={handleEmailChange}
                            value={data?.email}
                        />
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="dateofbirth" className="text-2xl font-semibold ps-2">Date of Birth</label>
                        {
                            data.dateOfBirth && <Datepicker options={{ defaultDate: new Date(data.dateOfBirth), theme: { input: "!bg-[#BCA9FF] text-white border-[#20183F] border-2 rounded-2xl py-4 placeholder-slate-300", inputIcon: "!text-white" } }} onChange={handleDateOfBirthChange} show={isDatepickerVisible} setShow={(state) => setIsDatepickerVisible(state)} />
                        }
                        {
                            !data.dateOfBirth && <Datepicker options={{ defaultDate: null, theme: { input: "!bg-[#BCA9FF] text-white border-[#20183F] border-2 rounded-2xl py-4 placeholder-slate-300", inputIcon: "!text-white" } }} onChange={handleDateOfBirthChange} show={isDatepickerVisible} setShow={(state) => setIsDatepickerVisible(state)} />
                        }
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="profilephoto" className="text-2xl font-semibold ps-2">Profile Photo</label>
                        <div className="relative">
                            <input type="file" id="profilephoto" className="w-full bg-[#BCA9FF] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-300"
                                onChange={handleProfilePhotoChange}
                            />
                            {
                                !(('File' in window && data.profilePhoto instanceof File)) && data.profilePhoto &&
                                <div className="absolute top-0 right-0 p-2 h-16 bg-[#0d0d0d] rounded-tr-2xl rounded-br-2xl">
                                    <img src={`${process.env.API_URL}/${data.profilePhoto}`} className="h-full" />
                                </div>

                            }
                        </div>
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