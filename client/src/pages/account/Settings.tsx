import { useEffect } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"

import { useDecodedToken } from '../../hooks/useDecodedToken'
import useAxios from '../../hooks/useAxios'

interface ISettingsInput {
    email: string,
    password: string
}
export const Settings = () => {

    const axiosInstance = useAxios()
    const decodedToken = useDecodedToken()

    const { register, formState: { errors }, handleSubmit, reset } = useForm<ISettingsInput>()

    const onSubmit: SubmitHandler<ISettingsInput> = async (data) => {
        console.log(data)
        try {
            const response = await axiosInstance.put(`${process.env.API_URL}/user/${decodedToken.userId}`, data)
            console.log(response.data)
            // window.location.reload();

        } catch (error) {
            console.error('Error updating settings data:', error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(`${process.env.API_URL}/user/${decodedToken.userId}`)
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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 h-full justify-center">

            <div className="flex flex-col gap-y-1">
                <label htmlFor="username" className="text-2xl font-semibold ps-2">Username</label>
                <input type="text" id="username" value={decodedToken.username} className="bg-[#402798] border-[#20183F] border-2 rounded-2xl px-6 py-4 disabled:text-[#999999] disabled:cursor-not-allowed" readOnly disabled />
            </div>

            <div className="flex flex-col gap-y-1">
                <label htmlFor="email" className="text-2xl font-semibold ps-2">Email</label>
                <input type="text" id="email" className="w-full bg-[#6841f2] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-300 outline-1 focus:outline-dashed outline-indigo-500" placeholder="Type here..."
                    {...register("email", {
                        required: "required",
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Entered value does not match email format"
                        }
                    })}
                />
                <div className="text-sm mt-1 px-4">
                    <ErrorMessage errors={errors} name="email" render={({ message }) => <p>{message}</p>} />
                </div>
            </div>

            <button type="submit" className="w-full mt-4 bg-[#DBBA12] rounded-2xl py-3 text-2xl [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#0D0D0D]">
                Update
            </button>
        </form>
    )
}

export default Settings