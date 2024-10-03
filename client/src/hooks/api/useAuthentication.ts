import { useAppDispatch } from '../../redux/hooks';
import {
  setAccessToken,
  clearAccessToken,
} from '../../redux/features/authSlice';
import useAxios from '../useAxios';
import { isApiError } from '../../helper/apiHelpers';
import { errorMessages } from '../../constants/errorMessages';

const useAuthentication = () => {
  const dispatch = useAppDispatch();
  const axiosInstance = useAxios();

  const loginCall = async (
    username: string,
    password: string
  ): Promise<string> => {
    try {
      const response = await axiosInstance.post(
        `${process.env.USER_API_URL}/login`,
        {
          username,
          password,
        }
      );

      dispatch(setAccessToken(response.data.accessToken));
      return response.data.message;
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.default;

      throw errorMessage;
    }
  };

  const signupCall = async (
    username: string,
    email: string,
    password: string
  ): Promise<string> => {
    try {
      const response = await axiosInstance.post(
        `${process.env.USER_API_URL}/sign-up`,
        {
          username,
          email,
          password,
        }
      );
      return response.data.message;
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.default;

      throw errorMessage;
    }
  };

  const logoutCall = async () => {
    try {
      await axiosInstance.post(`${process.env.USER_API_URL}/logout`);
      dispatch(clearAccessToken());
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return { loginCall, signupCall, logoutCall };
};

export default useAuthentication;
