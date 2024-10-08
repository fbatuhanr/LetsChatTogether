/* eslint-disable react-hooks/exhaustive-deps */
import useAxios from "../useAxios";
import { isApiError } from "../../helper/apiHelpers";
import { errorMessages } from "../../constants/errorMessages";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setNotifications,
  clearNotifications,
} from "../../redux/features/notificationSlice";

const useGeneralNotifications = (currentUserId: string) => {
  const notifications = useAppSelector((state) => state.notifications);
  const dispatch = useAppDispatch();
  const axiosInstance = useAxios();

  const getTotalNotificationsCount = () =>
    notifications.totalUnreadMessageCount +
    notifications.totalIncomingRequestCount;
  const getTotalUnreadMessageCount = () =>
    notifications.totalUnreadMessageCount;
  const getTotalIncomingRequestCount = () =>
    notifications.totalIncomingRequestCount;

  const fetchGeneralNotifications = async () => {
    if (!currentUserId) return;

    try {
      const response = await axiosInstance.get(`notification/${currentUserId}`);
      // console.log(response.data);
      dispatch(setNotifications(response.data));
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.default;

      console.error(errorMessage);
      dispatch(clearNotifications());
    }
  };

  return {
    getTotalNotificationsCount,
    getTotalUnreadMessageCount,
    getTotalIncomingRequestCount,

    fetchGeneralNotifications,
  };
};

export default useGeneralNotifications;
