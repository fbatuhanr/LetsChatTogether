import { useState, useEffect } from 'react';
import useAxios from '../useAxios';
import { User } from '../../types/User';

const useFetchUserByUsername = (username: string) => {
    
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.USER_API_URL}/search`, {
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