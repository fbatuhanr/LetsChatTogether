import { useState } from "react";
import useAxios from "../useAxios";
import { FriendProps } from "../../types/User.types";
import { isApiError } from "../../helper/apiHelpers";
import { errorMessages } from "../../constants/errorMessages";

export enum RequestStatus {
  None = "none",
  Pending = "pending",
  Accepted = "accepted",
  Rejected = "rejected",
}

export interface FriendRequestStatus {
  isSender?: boolean;
  status: RequestStatus;
}
const useFriendship = (currentUserId: string) => {
  const axiosInstance = useAxios();

  const [friends, setFriends] = useState<Array<FriendProps> | null>(null);
  const [incomingRequests, setIncomingRequests] = useState<[] | null>(null);
  const [outgoingRequests, setOutgoingRequests] = useState<[] | null>(null);
  const [requestStatusBetweenUsers, setRequestStatusBetweenUsers] =
    useState<FriendRequestStatus | null>(null);

  const getFriends = async (includeUser: boolean = false) => {
    try {
      const response = await axiosInstance.get(
        `${process.env.API_URL}/friend/${currentUserId}`
      );
      if (!includeUser) {
        setFriends(response.data.friends);
      } else {
        const friendsWithUser = [
          {
            _id: response.data._id,
            username: response.data.username,
            profilePhoto: response.data.profilePhoto
              ? response.data.profilePhoto
              : null,
          },
          ...response.data.friends,
        ];
        setFriends(friendsWithUser);
      }
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.default;

      setFriends([]);
      console.error(errorMessage);
    }
  };

  const getIncomingRequests = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.API_URL}/friend-request/incoming/${currentUserId}`
      );
      setIncomingRequests(response.data);
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.default;

      setIncomingRequests([]);
      console.error(errorMessage);
    }
  };
  const getOutgoingRequests = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.API_URL}/friend-request/outgoing/${currentUserId}`
      );
      setOutgoingRequests(response.data);
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.default;

      setOutgoingRequests([]);
      console.error(errorMessage);
    }
  };
  const getRequestStatusBetweenUsers = async (targetUserId: string) => {
    try {
      const response = await axiosInstance.get(
        `${process.env.API_URL}/friend-request/status`,
        {
          params: {
            senderId: currentUserId,
            receiverId: targetUserId,
          },
        }
      );
      setRequestStatusBetweenUsers(response.data);
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.default;

      setRequestStatusBetweenUsers({ status: RequestStatus.None });
      console.error(errorMessage);
    }
  };

  const removeFriend = async (targetUserId: string): Promise<string> => {
    try {
        const response = await axiosInstance.delete(
          `${process.env.API_URL}/friend/${currentUserId}/${targetUserId}`
        );
        return response.data.message;
      } 
      catch (error: unknown) {
        const errorMessage =
          isApiError(error) && error.response?.data?.message
            ? error.response.data.message
            : errorMessages.default;

        throw errorMessage;
      }
  };
  const sendRequest = async (targetUserId: string): Promise<string> => {
    try {
      const response = await axiosInstance.post(
        `${process.env.API_URL}/friend-request/send`,
        {
          senderId: currentUserId,
          receiverId: targetUserId,
        }
      );
      return response.data.message;
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.sendRequest;

      throw errorMessage;
    }
  };
  const acceptRequest = async (targetUserId: string): Promise<string> => {
    try {
      const response = await axiosInstance.put(
        `${process.env.API_URL}/friend-request/accept`,
        {
          senderId: currentUserId,
          receiverId: targetUserId,
        }
      );
      return response.data.message;
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.acceptRequest;

      throw errorMessage;
    }
  };
  const cancelRequest = async (targetUserId: string): Promise<string> => {
    try {
      const response = await axiosInstance.delete(
        `${process.env.API_URL}/friend-request/cancel`,
        {
          data: {
            senderId: currentUserId,
            receiverId: targetUserId,
          },
        }
      );
      return response.data.message;
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.cancelRequest;

      throw errorMessage;
    }
  };

  return {
    friends,

    incomingRequests,
    outgoingRequests,
    requestStatusBetweenUsers,

    getFriends,
    getIncomingRequests,
    getOutgoingRequests,
    getRequestStatusBetweenUsers,

    removeFriend,
    sendRequest,
    acceptRequest,
    cancelRequest,
  };
};

export default useFriendship;
