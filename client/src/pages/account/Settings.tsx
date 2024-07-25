import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/hooks'

import axios from 'axios'

import Datepicker from "tailwind-datepicker-react"

interface IUser {
    email?: string,
    dateOfBirth?: Date,
    profilePhoto?: File | string
}

export const Settings = () => {

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
        <>
            <div className="flex flex-col gap-y-1">
                <label htmlFor="username" className="text-2xl font-semibold ps-2">Username</label>
                <input type="text" id="username" value={user.username} className="bg-[#402798] border-[#20183F] border-2 rounded-2xl px-6 py-4 disabled:text-[#999999] disabled:cursor-not-allowed" readOnly disabled />
            </div>

            <div className="flex flex-col gap-y-1">
                <label htmlFor="email" className="text-2xl font-semibold ps-2">Email</label>
                <input type="text" id="email" className="bg-[#6841f2] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-200" placeholder="Type here..."
                    onChange={handleEmailChange}
                    value={data?.email}
                />
            </div>

            <div className="flex flex-col gap-y-1">
                <label htmlFor="dateofbirth" className="text-2xl font-semibold ps-2">Date of Birth</label>
                {
                    data.dateOfBirth && <Datepicker options={{ defaultDate: new Date(data.dateOfBirth), theme: { input: "!bg-[#6841f2] text-white border-[#20183F] border-2 rounded-2xl py-4 placeholder-slate-300", inputIcon: "!text-white" } }} onChange={handleDateOfBirthChange} show={isDatepickerVisible} setShow={(state) => setIsDatepickerVisible(state)} />
                }
                {
                    !data.dateOfBirth && <Datepicker options={{ defaultDate: null, theme: { input: "!bg-[#6841f2] text-white border-[#20183F] border-2 rounded-2xl py-4 placeholder-slate-300", inputIcon: "!text-white" } }} onChange={handleDateOfBirthChange} show={isDatepickerVisible} setShow={(state) => setIsDatepickerVisible(state)} />
                }
            </div>

            <div className="flex flex-col gap-y-1">
                <label htmlFor="profilephoto" className="text-2xl font-semibold ps-2">Profile Photo</label>
                <div className="relative">
                    <input type="file" id="profilephoto" className="w-full bg-[#6841f2] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-300"
                        onChange={handleProfilePhotoChange}
                    />
                    {
                        !(('File' in window && data.profilePhoto instanceof File)) && data.profilePhoto &&
                        <div className="absolute top-0 bottom-0 right-0 p-0.5 bg-[#20183F] rounded-tr-2xl rounded-br-2xl">
                            <img src={`${process.env.API_URL}/${data.profilePhoto}`} className="h-full rounded-r-xl" />
                        </div>

                    }
                </div>
            </div>

            <button type="button" className="mt-4 bg-[#DBBA12] rounded-2xl py-3 text-2xl [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#0D0D0D]"
                onClick={handleSubmit}
            >
                Update
            </button>
        </>
    )
}

export default Settings