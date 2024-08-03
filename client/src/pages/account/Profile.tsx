import { useEffect, useState } from 'react'
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import Datepicker from "tailwind-datepicker-react"

import useAxios from '../../hooks/useAxios'
import { useDecodedToken } from '../../hooks/useDecodedToken'
import { User } from '../../types/User'

const Profile = () => {

    const axiosInstance = useAxios()
    const decodedToken = useDecodedToken()

    const [isDatepickerVisible, setIsDatepickerVisible] = useState<boolean>(false)
    const { register, control, watch, formState: { errors }, handleSubmit, reset } = useForm<User>()

    const onSubmit: SubmitHandler<User> = async (data) => {

        console.log(data)

        let newData = {
            ...data
        }

        if (('File' in window && data.profilePhoto instanceof FileList))
            newData = { ...newData, profilePhoto: data.profilePhoto[0] }

        console.log(newData)

        const headers = { 'Content-Type': 'multipart/form-data' };
        const response = await axiosInstance.put(`${process.env.API_URL}/user/${decodedToken.userId}`, newData, { headers })
        console.log(response.data);
        window.location.reload();
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(`${process.env.API_URL}/user/${decodedToken.userId}`)
                console.log(response.data)

                reset({
                    ...response.data,
                    dateOfBirth: response.data.dateOfBirth ? new Date(response.data.dateOfBirth) : null
                })

            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [reset])

    const watchProfilePhoto = watch('profilePhoto')
    useEffect(() => {
        console.log(watchProfilePhoto)
    }, [watchProfilePhoto])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 h-full justify-center">

            <div>
                <div className="flex justify-between gap-x-2">
                    <div className="w-full">
                        <label htmlFor="name" className="text-2xl font-semibold ps-2">Name</label>
                        <input type="text" id="name" className="w-full bg-[#6841f2] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-300 outline-1 focus:outline-dashed outline-indigo-500" placeholder="Type here..."
                            {...register('name', {
                                required: 'Name is required',
                                pattern: {
                                    value: /^[A-Za-z]+$/,
                                    message: 'Name should only contain letters without spaces'
                                },
                                minLength: {
                                    value: 2,
                                    message: 'Name must be at least 2 characters long'
                                },
                                maxLength: {
                                    value: 50,
                                    message: 'Name cannot be more than 50 characters long'
                                }
                            })}
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="surname" className="text-2xl font-semibold ps-2">Surname</label>
                        <input type="text" id="surname" className="w-full bg-[#6841f2] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-300 outline-1 focus:outline-dashed outline-indigo-500" placeholder="Type here..."
                            {...register('surname', {
                                required: 'Surname is required',
                                pattern: {
                                    value: /^[A-Za-z]+$/,
                                    message: 'Surname should only contain letters without spaces'
                                },
                                minLength: {
                                    value: 2,
                                    message: 'Surname must be at least 2 characters long'
                                },
                                maxLength: {
                                    value: 50,
                                    message: 'Surname cannot be more than 50 characters long'
                                }
                            })}
                        />
                    </div>
                </div>
                <div className="text-sm mt-1 px-4">
                    <ErrorMessage errors={errors} name="name" render={({ message }) => <p>{message}</p>} />
                    <ErrorMessage errors={errors} name="surname" render={({ message }) => <p>{message}</p>} />
                </div>
            </div>

            <div className="flex justify-between gap-x-2">
                <div className="w-full">
                    <label htmlFor="gender" className="text-2xl font-semibold ps-2">Gender</label>
                    <select id="gender" className="w-full bg-[#6841f2] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-200 outline-1 focus:outline-dashed outline-indigo-500"
                        {...register('gender', {
                            required: 'Gender is required'
                        })}
                    >
                        <option value="">Choose...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <ErrorMessage errors={errors} name="gender" render={({ message }) => <p>{message}</p>} />
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
                                        input: "!bg-[#6841f2] text-white !border-[#20183F] border-2 rounded-2xl py-4 placeholder-slate-300 outline-1 focus:outline-dashed outline-indigo-500",
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
                    <input type="file" id="profilePhoto" className="w-full bg-[#6841f2] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-300 outline-1 focus:outline-dashed outline-indigo-500"
                        {...register("profilePhoto")} multiple={false}
                    />
                    {
                        ((watchProfilePhoto instanceof FileList || typeof watchProfilePhoto === 'string') && watchProfilePhoto.length) &&
                        <div className="absolute top-0 bottom-0 right-0 p-0.5 bg-[#20183F] rounded-tr-2xl rounded-br-2xl">
                            <img className="h-full rounded-r-xl"
                                src={
                                    (watchProfilePhoto instanceof FileList)
                                        ? URL.createObjectURL(watchProfilePhoto[0])
                                        : `${process.env.API_URL}/${watchProfilePhoto}`
                                }
                            />
                        </div>
                    }
                </div>
            </div>


            <div className="flex flex-col gap-y-1">
                <label htmlFor="about" className="text-2xl font-semibold ps-2">About</label>
                <textarea id="about" className="w-full bg-[#6841f2] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-300 outline-1 focus:outline-dashed outline-indigo-500" placeholder="anything about yourself..."
                    {...register('about')}
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