import { Link, useParams } from "react-router-dom";
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

    const { username } = useParams()

    const decodedToken = useDecodedToken()
    const { data, loading, error } = username ? useFetchUser(username) : defaultFetchUser

    if (loading) return <LoadingSpinner />
    if (!data || error) return <NotFound />

    return (
        <div className="relative flex flex-col gap-y-4 justify-center items-center bg-blur-ellipse-small bg-[center_top_-1rem] bg-[length:200px] bg-no-repeat">
            <div>
                <h1 className="text-5xl font-bold">{username}</h1>
            </div>
            <div className="z-10 w-11/12 md:w-full max-w-3xl min-h-[400px] px-4 md:px-8 rounded-xl bg-gradient-to-br from-[#4F22F2] to-[#20183F] border-[#3a1da2] border">
                <div className="w-11/12 mx-auto px-4 py-10">
                    <div className="flex items-center px-8">
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
                    <div className="mt-6 mb-10 px-2">
                        <p className="p-4 bg-[#20183F] bg-opacity-20 rounded shadow-xl">
                            {
                                data.about
                                    ? data.about
                                    : "There is no about information..."
                            }
                        </p>
                    </div>
                    {
                        decodedToken.userId ?
                            decodedToken.username !== username &&
                            <FriendRequestButton targetUserId={data._id} />
                            :
                            <div className="text-center py-2">
                                <Link to="/login" className="bg-[#6841F2] px-8 py-2.5 rounded-2xl text-xl font-semibold [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#211a3c] shadow-md">
                                    Join Now to Add Friends and Message!
                                </Link>
                            </div>
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