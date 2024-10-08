/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import useFriendship from "../../hooks/api/useFriendship";
import { useDecodedToken } from "../../hooks/useDecodedToken";

import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaEye, FaTrash } from "react-icons/fa";
import { IoIosChatboxes } from "react-icons/io";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FriendProps } from "../../types/User.types";
import {
  IncomingRequestProps,
  OutgoingRequestProps,
} from "../../types/Request.types";
import useGeneralNotifications from "../../hooks/api/useGeneralNotifications";
import LoadingSpinnerPage from "../../components/loading/LoadingSpinnerPage";

const Friends = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  const decodedToken = useDecodedToken();

  const { fetchGeneralNotifications } = useGeneralNotifications(decodedToken.userId);

  const {
    friends,
    incomingRequests,
    outgoingRequests,

    getFriends,
    getIncomingRequests,
    getOutgoingRequests,

    removeFriend,
    acceptRequest,
    cancelRequest,
  } = useFriendship(decodedToken.userId);

  useEffect(() => {
    Promise.all([getFriends(), getIncomingRequests(), getOutgoingRequests()])
    .finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleAcceptRequest = async (targetUserId: string) => {
    if (isLoading) return;

    setIsLoading(true);
    await toast.promise(acceptRequest(targetUserId), {
      pending: "Request sending...",
      success: { render: ({ data }) => `${data}` },
      error: { render: ({ data }) => `${data}` },
    });
    setIsLoading(false);

    fetchGeneralNotifications();
    getIncomingRequests();
    getFriends();
  };

  const handleCancelReceivedRequest = async (targetUserId: string) => {
    if (isLoading) return;

    setIsLoading(true);
    await toast.promise(cancelRequest(targetUserId), {
      pending: "Request sending...",
      success: { render: ({ data }) => `${data}` },
      error: { render: ({ data }) => `${data}` },
    });
    setIsLoading(false);

    fetchGeneralNotifications();
    getIncomingRequests();
  };

  const handleCancelSentRequest = async (targetUserId: string) => {
    if (isLoading) return;

    setIsLoading(true);
    await toast.promise(cancelRequest(targetUserId), {
      pending: "Request sending...",
      success: { render: ({ data }) => `${data}` },
      error: { render: ({ data }) => `${data}` },
    });
    setIsLoading(false);

    getOutgoingRequests();
  };

  const handleRemoveFriend = async (targetUserId: string) => {
    if (isLoading) return;

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

    setIsLoading(true);
    await toast.promise(removeFriend(targetUserId), {
      pending: "Request sending...",
      success: { render: ({ data }) => `${data}` },
      error: { render: ({ data }) => `${data}` },
    });
    setIsLoading(false);

    getFriends();
  };

  if (isLoading) return <LoadingSpinnerPage />;
  return (
    <div className="w-full grid lg:grid-cols-[1fr_1.3fr_1fr] gap-4">
      <div>
        <h3 className="border-b mb-4 px-2 text-xl">
          Active Friends ({friends?.length ? friends.length : 0})
        </h3>
        <div className="px-1">
          <ul>
            {friends &&
              friends.map((friend: FriendProps, index: number) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-xl my-1 ps-4 pe-2.5 py-1 bg-black bg-opacity-20 rounded-xl"
                >
                  <Link
                    to={`/user/${friend.username}`}
                    className="flex items-center gap-x-1"
                  >
                    {friend.username}
                    <FaEye className="text-lg text-white mt-0.5" />
                  </Link>
                  <div className="flex items-center gap-x-2">
                    <Link to="/chat">
                      <IoIosChatboxes className="text-xl text-white" />
                    </Link>
                    <button onClick={() => handleRemoveFriend(friend._id)}>
                      <FaTrash className="text-sm text-red-600" />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div>
        <h3 className="border-b mb-4 px-2 text-xl">
          Received Requests (
          {incomingRequests?.length ? incomingRequests.length : 0})
        </h3>
        <div className="px-1">
          <ul>
            {incomingRequests &&
              incomingRequests.map(
                (request: IncomingRequestProps, index: number) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-xl my-1 ps-4 pe-2 py-1 bg-black bg-opacity-20 rounded-xl"
                  >
                    <Link to={`/user/${request.sender.username}`}>
                      {request.sender.username}
                    </Link>
                    <div className="flex items-center gap-x-1.5">
                      <button
                        onClick={() => handleAcceptRequest(request.sender._id)}
                      >
                        <FaCircleCheck className="text-2xl text-[#0dd112]" />
                      </button>
                      <button onClick={() => handleCancelReceivedRequest(request.sender._id)}>
                        <FaCircleXmark className="text-xl text-[#f33825]" />
                      </button>
                    </div>
                  </li>
                )
              )}
          </ul>
        </div>
      </div>
      <div>
        <h3 className="border-b mb-4 px-2 text-xl">
          Sent Requests (
          {outgoingRequests?.length ? outgoingRequests.length : 0})
        </h3>
        <div className="px-1">
          <ul>
            {outgoingRequests &&
              outgoingRequests.map(
                (request: OutgoingRequestProps, index: number) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-xl my-1 ps-4 pe-2 py-1 bg-black bg-opacity-20 rounded-xl"
                  >
                    <Link to={`/user/${request.receiver.username}`}>
                      {request.receiver.username}
                    </Link>
                    <div className="flex items-center gap-x-1.5">
                      <button
                        onClick={() =>
                          handleCancelSentRequest(request.receiver._id)
                        }
                      >
                        <FaCircleXmark className="text-2xl text-[#f33825]" />
                      </button>
                    </div>
                  </li>
                )
              )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Friends;
