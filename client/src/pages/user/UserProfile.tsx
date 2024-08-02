import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { useDecodedToken } from "../../hooks/useDecodedToken";
import { calculateAge } from "../../utils/dateUtils";
import { getZodiac, getZodiacSign, getZodiacSymbol } from "../../utils/zodiacUtils";
import { getGenderSign } from "../../utils/genderUtils";
import MessageImg from "../../assets/message.png"

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
    }, [])


    return (
        data &&
        <div className="py-8 flex flex-col gap-y-6 justify-center items-center bg-blur-ellipse-small bg-[center_top_-1rem] bg-[length:200px] bg-no-repeat">
            <div>
                <h1 className="text-5xl font-bold">User Profile</h1>
            </div>
            <div className="relative w-full max-w-3xl min-h-[400px] rounded bg-gradient-to-br from-[#0D0D0D] to-[#472DA6] border-[#472DA6] border-2">
                <div className="w-3/4 mx-auto my-12 px-4 ">

                    <div className="flex items-center">
                        <div className="w-40 h-40 rounded-full bg-[#D9D9D9] overflow-hidden p-2 border-2 border-[#472DA6]">
                            <img src={`${process.env.API_URL}/${data.profilePhoto}`} width="100%" height="auto" className="scale-125" />
                        </div>
                        <div className="w-[calc(100%_-_10rem)]">
                            <h2 className="text-4xl font-bold text-center tracking-wide">{`${data.name} ${data.surname}`}</h2>
                            <div className="flex justify-between items-center w-4/5 mx-auto mt-4 px-6 border-b">
                                <div>{calculateAge(data.dateOfBirth)}</div>
                                <div>{getZodiac(data.dateOfBirth)}</div>
                                <div>{getGenderSign(data.gender)}</div>
                                <div>{new Date(data.dateOfBirth).toDateString()}</div>
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
        </div>
    )
}

export default UserProfile