/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import useFriendRequest, { RequestStatus } from "../hooks/api/useFriendship";
import MessageImg from "../assets/message.png";
import { toast } from "react-toastify";
import { useDecodedToken } from "../hooks/useDecodedToken";
import Swal from "sweetalert2";
import LoadingDots from "./loading/LoadingDots";

interface FriendRequestButtonProps {
  targetUserId: string;
}

const FriendRequestButton: React.FC<FriendRequestButtonProps> = ({
  targetUserId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const decodedToken = useDecodedToken();

  const {
    requestStatusBetweenUsers,
    getRequestStatusBetweenUsers,
    isLoadingRequestStatusBetweenUsers,

    removeFriend,
    sendRequest,
    acceptRequest,
    cancelRequest,
  } = useFriendRequest(decodedToken.userId);

  useEffect(() => {
    getRequestStatusBetweenUsers(targetUserId);
  }, []);

  const handleClick = async () => {
    let methodToCall;

    if (requestStatusBetweenUsers?.status === RequestStatus.Pending) {
      methodToCall = () => cancelRequest(targetUserId);
    } else if (requestStatusBetweenUsers?.status === RequestStatus.Accepted) {
      const swalResult = await Swal.fire({
        title: "Do you want to remove your friend?",
        text: "This action cannot be undone!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No, cancel!",
      });
      if (!swalResult.isConfirmed) return;

      methodToCall = () => removeFriend(targetUserId);
    } else if (
      requestStatusBetweenUsers?.status === RequestStatus.Rejected ||
      requestStatusBetweenUsers?.status === RequestStatus.None
    ) {
      methodToCall = () => sendRequest(targetUserId);
    } else {
      console.error("Unknown status");
      return;
    }

    setIsLoading(true);
    toast
      .promise(methodToCall(), {
        pending: "Request sending...",
        success: { render: ({ data }) => `${data}` },
        error: { render: ({ data }) => `${data}` },
      })
      .then(() => {
        return getRequestStatusBetweenUsers(targetUserId);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAcceptRequest = () => {
    setIsLoading(true);
    toast
      .promise(acceptRequest(targetUserId), {
        pending: "Request sending...",
        success: { render: ({ data }) => `${data}` },
        error: { render: ({ data }) => `${data}` },
      })
      .then(() => {
        return getRequestStatusBetweenUsers(targetUserId);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getButtonText = () => {
    if (requestStatusBetweenUsers?.status === RequestStatus.Pending) {
      return "Cancel Request";
    } else if (requestStatusBetweenUsers?.status === RequestStatus.Accepted) {
      return "Remove Friend";
    } else if (
      requestStatusBetweenUsers?.status === RequestStatus.Rejected ||
      requestStatusBetweenUsers?.status === RequestStatus.None
    ) {
      return "Friend Request";
    }
  };

  const getButtonClasses = () => {
    if (requestStatusBetweenUsers?.status === RequestStatus.Pending) {
      return "bg-yellow-600 text-gray-200";
    } else if (requestStatusBetweenUsers?.status === RequestStatus.Accepted) {
      return "bg-red-500";
    } else if (
      requestStatusBetweenUsers?.status === RequestStatus.Rejected ||
      requestStatusBetweenUsers?.status === RequestStatus.None
    ) {
      return "bg-yellow-400";
    }
  };

  if (isLoading || isLoadingRequestStatusBetweenUsers)
    return <LoadingDots />;

  return (
    requestStatusBetweenUsers &&
    <div className="flex flex-col gap-y-4 text-center w-3/4 mx-auto lg:w-full lg:gap-y-0 lg:flex-row lg:justify-center lg:gap-x-8">
      <button
        className={`ps-8 pe-12 py-2 text-xl font-bold rounded-2xl [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#211a3c] shadow-md relative ${getButtonClasses()}`}
        onClick={handleClick}
      >
        {getButtonText()}
        <img
          src={MessageImg}
          className="absolute w-16 h-auto -top-4 -right-6"
          alt="Message Icon"
        />
      </button>
      {requestStatusBetweenUsers.status === RequestStatus.Pending &&
        !requestStatusBetweenUsers.isSender && (
          <button
            className="ps-8 pe-12 py-2 text-xl font-bold rounded-2xl [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#211a3c] shadow-md relative bg-green-600 text-white"
            onClick={handleAcceptRequest}
          >
            Accept Request
            <img
              src={MessageImg}
              className="absolute w-16 h-auto -top-4 -right-6"
              alt="Message Icon"
            />
          </button>
        )}
    </div>
  );
};

export default FriendRequestButton;
