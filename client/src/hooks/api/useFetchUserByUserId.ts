/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import useAxios from "../useAxios";
import { UserProps } from "../../types/User.types";

const useFetchUserByUserId = (userId: string) => {
  const axiosInstance = useAxios();

  const [data, setData] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`user/${userId}`);
        setData(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return { data, loading, error };
};

export default useFetchUserByUserId;
