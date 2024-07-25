import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/hooks'
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import axios from 'axios'
import Datepicker from "tailwind-datepicker-react"

interface IProfileInput {
    name: string,
    surname: string,
    gender: 'male' | 'female' | 'other',
    dateOfBirth?: Date,
    profilePhoto?: FileList | File | string | null,
    about: string | null
}
export const Profile = () => {

    const user = useAppSelector((state) => state.user)
    const [isDatepickerVisible, setIsDatepickerVisible] = useState<boolean>(false)

    const { register, control, watch, handleSubmit, reset } = useForm<IProfileInput>()

    const onSubmit: SubmitHandler<IProfileInput> = (data) => {

        console.log(data)

        let newData = {
            ...data
        }

        if (('File' in window && data.profilePhoto instanceof File))
            newData = { ...newData, profilePhoto: data.profilePhoto }

        console.log(newData)
        return

        const headers = { 'Content-Type': 'multipart/form-data' };
        axios.put(`${process.env.API_URL}/user/${user.id}`, newData, { headers })
            .then((response) => {
                console.log(response.data);
                window.location.reload();
            });
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`${process.env.API_URL}/user/${user.id}`)
                console.log(response.data)

                reset({
                    ...response.data,
                    dateOfBirth: new Date(response.data.dateOfBirth),
                });

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [reset])

    const watchProfilePhoto = watch('profilePhoto');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-3/4 mx-auto my-12 px-4 flex flex-col gap-y-3 h-full justify-center">

            <div className="flex justify-between gap-x-1">
                <div className="w-full">
                    <label htmlFor="name" className="text-2xl font-semibold ps-2">Name</label>
                    <input type="text" id="name" className="w-full bg-[#6841f2] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-200 outline-1 focus:outline-dashed outline-indigo-500" placeholder="Type here..."
                        {...register("name")}
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="surname" className="text-2xl font-semibold ps-2">Surname</label>
                    <input type="text" id="surname" className="w-full bg-[#6841f2] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-200 outline-1 focus:outline-dashed outline-indigo-500" placeholder="Type here..."
                        {...register("surname")}
                    />
                </div>
            </div>

            <div className="flex justify-between gap-x-1">
                <div className="w-full">
                    <label htmlFor="gender" className="text-2xl font-semibold ps-2">Gender</label>
                    <select id="gender" className="w-full bg-[#6841f2] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-200 outline-1 focus:outline-dashed outline-indigo-500"
                        {...register('gender')}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="w-full">
                    <label htmlFor="dateofbirth" className="text-2xl font-semibold ps-2">Date of Birth</label>
                    <Controller
                        name="dateOfBirth"
                        control={control}
                        render={({ field }) => (
                            <Datepicker
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                show={isDatepickerVisible} setShow={(state) => setIsDatepickerVisible(state)}
                                options={{
                                    defaultDate: field.value,
                                    autoHide: true,
                                    todayBtn: false,
                                    clearBtn: true,
                                    theme: {
                                        background: "",
                                        todayBtn: "",
                                        clearBtn: "",
                                        icons: "",
                                        text: "",
                                        disabledText: "",
                                        input: "!bg-[#6841f2] text-white border-[#20183F] border-2 rounded-2xl py-4 placeholder-slate-300 outline-1 focus:outline-dashed outline-indigo-500",
                                        inputIcon: "!text-white",
                                        selected: "",
                                    }
                                }}
                            />
                        )}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-y-1">
                <label htmlFor="profilePhoto" className="text-2xl font-semibold ps-2">Photo</label>
                <div className="relative">
                    <input type="file" id="profilePhoto" className="w-full bg-[#6841f2] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-300"
                        {...register("profilePhoto")} multiple={false}
                    />
                    {
                        watchProfilePhoto &&
                        <div className="absolute top-0 bottom-0 right-0 p-0.5 bg-[#20183F] rounded-tr-2xl rounded-br-2xl">
                            <img src={('File' in window && watchProfilePhoto instanceof FileList) ? URL.createObjectURL(watchProfilePhoto[0]) : `${process.env.API_URL}/${watchProfilePhoto}`} className="h-full rounded-r-xl" />
                        </div>
                    }
                </div>
            </div>


            <div className="flex flex-col gap-y-1">
                <label htmlFor="about" className="text-2xl font-semibold ps-2">About Yourself</label>
                <textarea id="about" className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    {...register('about', { required: 'Yorum alanı gereklidir' })}
                    rows={4}
                />
            </div>

            <button type="submit" className="w-full mt-4 bg-[#DBBA12] rounded-2xl py-3 text-2xl [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#0D0D0D]">
                Update
            </button>
        </form>
    )
}

export default Profile