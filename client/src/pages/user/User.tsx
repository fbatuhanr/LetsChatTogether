import { useParams } from "react-router-dom";
import { useDecodedToken } from "../../hooks/useDecodedToken"

import { Age, Zodiac, Gender, BirthDate } from "../../components/user"

import cosmicButterFlyLeft from "../../assets/background/cosmic-butterfly-left.png"

import userAvatar from "../../assets/user-avatar.jpg"
import useFetchUser from "../../hooks/api/useFetchUserByUsername";
import LoadingSpinner from "../../components/LoadingSpinner";
import NotFound from "../../components/NotFound";
import { defaultFetchUser } from "../../constants/defaultValues";
import FriendRequestButton from "../../components/FriendRequestButton";


const User = () => {

    const { username } = useParams();

    const decodedToken = useDecodedToken()
    const { data, loading, error } = username ? useFetchUser(username) : defaultFetchUser

    if (loading) return <LoadingSpinner />
    if (!data || error) return <NotFound />
    
    return (
        <div className="relative flex flex-col gap-y-6 justify-center items-center bg-blur-ellipse-small bg-[center_top_-1rem] bg-[length:200px] bg-no-repeat">
            <div>
                <h1 className="text-5xl font-bold">{username}</h1>
            </div>
            <div className="relative z-10 w-full max-w-3xl min-h-[400px] rounded bg-gradient-to-br from-[#0D0D0D] to-[#472DA6] border-[#472DA6] border-2">
                <div className="w-3/4 mx-auto my-12 px-4">

                    <div className="flex items-center">
                        <div className="w-40 h-40 rounded-full overflow-hidden p-2 border-2 border-[#472DA6]">
                            <img src={data.profilePhoto ? `${process.env.API_URL}/${data.profilePhoto}` : userAvatar} width="100%" height="auto" className="scale-125" />
                        </div>
                        <div className="w-[calc(100%_-_10rem)] font-roboto">
                            <h2 className="text-4xl font-bold text-center tracking-wide">
                                {
                                    !data.name && !data.surname
                                        ? "No Information"
                                        :
                                        `${data.name && data.name} ${data.surname && data.surname}`
                                }
                            </h2>
                            <div className="flex justify-center items-center w-[90%] mx-auto mt-4 border-b font-semibold text-sm">
                                <div className="border-r pr-2">
                                    {data.dateOfBirth && <Age dateOfBirth={data.dateOfBirth} />}
                                </div>
                                <div className="border-r pl-1 pr-2">
                                    {data.dateOfBirth && <Zodiac dateOfBirth={data.dateOfBirth} />}
                                </div>
                                <div className="border-r pl-1 pr-2">
                                    {data.gender && <Gender gender={data.gender} />}
                                </div>
                                <div className="pl-2">
                                    {data.dateOfBirth && <BirthDate dateOfBirth={data.dateOfBirth} />}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 mb-12">
                        <p className="p-2">
                            {data.about}
                        </p>
                    </div>

                    {
                        decodedToken.username !== username &&
                        <FriendRequestButton senderId={decodedToken.userId} receiverId={data._id} />
                    }
                </div>
            </div>

            <div className="absolute top-0 left-28">
                <img src={cosmicButterFlyLeft} className="w-[35rem] h-auto" />
            </div>

            <div className="absolute top-0 right-48">
                <img src={cosmicButterFlyLeft} className="w-[35rem] h-auto" />
            </div>
        </div>
    )
}

export default User