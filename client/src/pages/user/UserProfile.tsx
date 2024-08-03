import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { useDecodedToken } from "../../hooks/useDecodedToken";
import { calculateAge } from "../../utils/dateUtils";
import { getZodiac, getZodiacSign, getZodiacSymbol } from "../../utils/zodiacUtils";
import { getGenderSign } from "../../utils/genderUtils";
import MessageImg from "../../assets/message.png"

import { MdCake } from "react-icons/md";
import Zodiac from "../../components/user/Zodiac";
import Age from "../../components/user/Age";
import Gender from "../../components/user/Gender";
import BirthDate from "../../components/user/BirthDate";

import cosmicButterFlyLeft from "../../assets/background/cosmic-butterfly-left.png"


const UserProfile = () => {

    const { username } = useParams();

    const axiosInstance = useAxios();
    const decodedToken = useDecodedToken()

    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchUserByUsername = async () => {
            try {
                const response = await axiosInstance.get(`${process.env.USER_API_URL}/search`, {
                    params: { username }
                });
                console.log(response.data)

                setData(response.data)

            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchUserByUsername()
    }, [username])


    return (
        data &&
        <div className="relative flex flex-col gap-y-6 justify-center items-center bg-blur-ellipse-small bg-[center_top_-1rem] bg-[length:200px] bg-no-repeat">
            <div>
                <h1 className="text-5xl font-bold">User Profile</h1>
            </div>
            <div className="relative z-10 w-full max-w-3xl min-h-[400px] rounded bg-gradient-to-br from-[#0D0D0D] to-[#472DA6] border-[#472DA6] border-2">
                <div className="w-3/4 mx-auto my-12 px-4">

                    <div className="flex items-center">
                        <div className="w-40 h-40 rounded-full bg-[#D9D9D9] overflow-hidden p-2 border-2 border-[#472DA6]">
                            <img src={`${process.env.API_URL}/${data.profilePhoto}`} width="100%" height="auto" className="scale-125" />
                        </div>
                        <div className="w-[calc(100%_-_10rem)] font-roboto">
                            <h2 className="text-4xl font-bold text-center tracking-wide">
                                {`${data.name} ${data.surname}`}
                            </h2>
                            <div className="flex justify-center items-center w-[90%] mx-auto mt-4 border-b font-semibold text-sm">
                                <div className="border-r pr-2">
                                    <Age dateOfBirth={data.dateOfBirth} />
                                </div>
                                <div className="border-r pl-1 pr-2">
                                    <Zodiac dateOfBirth={data.dateOfBirth} />
                                </div>
                                <div className="border-r pl-1 pr-2">
                                    <Gender gender={data.gender} />
                                </div>
                                <div className="pl-2">
                                    <BirthDate dateOfBirth={data.dateOfBirth} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 mb-12">
                        <p>
                            {data.about}
                        </p>
                    </div>

                    <div className="text-center">
                        <button className="ps-10 pe-14 py-3 text-2xl font-bold border border-[#0D0D0D] bg-[#F2D541] rounded-full [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#0D0D0D] relative">
                            Friend Request
                            <img src={MessageImg} className="absolute w-20 h-auto -top-5 -right-8" />
                        </button>
                    </div>

                </div>
            </div>

            <div className="absolute top-0 left-28">
                <img src={cosmicButterFlyLeft} className="w-[35rem] h-auto"/>
            </div>

            <div className="absolute top-0 right-48">
                <img src={cosmicButterFlyLeft} className="w-[35rem] h-auto"/>
            </div>
        </div>
    )
}

export default UserProfile