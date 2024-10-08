/* eslint-disable react-hooks/rules-of-hooks */
import { Link, useParams } from "react-router-dom";
import { useDecodedToken } from "../../hooks/useDecodedToken";

import { Age, Zodiac, Gender, BirthDate } from "../../components/user";

import cosmicButterFlyLeft from "../../assets/background/cosmic-butterfly-left.png";

import useFetchUser from "../../hooks/api/useFetchUserByUsername";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import NotFound from "../../components/NotFound";
import { defaultFetchUser } from "../../constants/defaultValues";
import FriendRequestButton from "../../components/FriendRequestButton";
import LinkButton from "../../components/general/clickable/LinkButton";
import Img from "../../components/general/Img";

const User = () => {
  const { username } = useParams();

  const decodedToken = useDecodedToken();
  const { data, loading, error } = username
    ? useFetchUser(username)
    : defaultFetchUser;

  if (loading) return <LoadingSpinner />;
  if (!data || error)
    return (
      <NotFound
        optionalAltText="Sorry, we can't find that user. You'll find lots to explore on the home page."
        backToHomeButton
      />
    );

  return (
    <div className="px-2 lg:px-0 relative flex flex-col gap-y-4 justify-center items-center bg-blur-ellipse-small bg-[center_top_-1rem] bg-[length:200px] bg-no-repeat">
      <div>
        <h1 className="text-5xl font-bold">{username}</h1>
      </div>
      <div className="z-10 w-full lg:w-11/12 max-w-3xl min-h-[400px] px-2 lg:px-8 rounded-xl bg-gradient-to-br from-[#4F22F2] to-[#20183F] border-[#3a1da2] border">
        <div className="w-full lg:w-11/12 mx-auto px-2 lg:px-4 py-12 lg:py-10">
          <div className="flex flex-col gap-y-3 lg:gap-y-0 lg:flex-row items-center lg:px-8">
            <div className="flex w-40 h-40 rounded-full overflow-hidden p-2 border-2 border-[#472DA6]">
              <Img
                src={
                  typeof data.profilePhoto === "string" ? data.profilePhoto : ""
                }
                width="100%"
                height="auto"
                className="scale-125"
              />
            </div>
            <div className="w-full lg:w-[calc(100%_-_10rem)] font-roboto">
              <h2 className="text-4xl font-bold text-center tracking-wide">
                {!data.name && !data.surname
                  ? "No Information"
                  : `${data.name && data.name} ${data.surname && data.surname}`}
              </h2>
              <div className="flex justify-center items-center w-full lg:w-[90%] mx-auto mt-6 lg:mt-4 border-b font-semibold text-[0.81rem] lg:text-sm">
                <div className="border-r pr-2">
                  {data.dateOfBirth && <Age dateOfBirth={data.dateOfBirth} />}
                </div>
                <div className="border-r pl-1 pr-2">
                  {data.dateOfBirth && (
                    <Zodiac dateOfBirth={data.dateOfBirth} />
                  )}
                </div>
                <div className="border-r pl-1 pr-2">
                  {data.gender && <Gender gender={data.gender} />}
                </div>
                <div className="pl-2">
                  {data.dateOfBirth && (
                    <BirthDate dateOfBirth={data.dateOfBirth} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 mb-14 lg:mt-6 lg:mb-10 px-2">
            <p className="p-4 bg-[#20183F] bg-opacity-20 rounded shadow-xl">
              {data.about ? data.about : "There is no about information..."}
            </p>
          </div>
          {decodedToken.userId ? (
            decodedToken.username === username ? (
              <LinkButton
                text="Edit Profile"
                target="/account/profile"
                size="2xl"
                innerHeight={2}
              />
            ) : (
              <FriendRequestButton targetUserId={data._id} />
            )
          ) : (
            <div className="text-center py-2">
              <Link
                to="/login"
                className="bg-[#6841F2] px-2 text-lg lg:px-8 lg:text-xl py-2.5 rounded-2xl font-semibold [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#211a3c] shadow-md"
              >
                Join Now to Add Friends!
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-0 left-28">
        <img src={cosmicButterFlyLeft} className="w-[35rem] h-auto" />
      </div>

      <div className="absolute top-0 right-48">
        <img src={cosmicButterFlyLeft} className="w-[35rem] h-auto" />
      </div>
    </div>
  );
};

export default User;
