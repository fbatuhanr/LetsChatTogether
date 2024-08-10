import { useState, useEffect } from 'react';
import useAxios from '../useAxios';
import { UserProps } from '../../types/User.types';

const useFetchUserByUsername = (username: string) => {
    
  const axiosInstance = useAxios();
  
  const [data, setData] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.USER_API_URL}/find`, {
          params: { username },
        });
        setData(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  return { data, loading, error };
};

export default useFetchUserByUsername