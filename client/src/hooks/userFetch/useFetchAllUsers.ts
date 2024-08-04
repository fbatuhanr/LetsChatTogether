import { useState, useEffect } from 'react';
import useAxios from '../useAxios';
import { User } from '../../types/User';

const useFetchAllUsers = () => {
    
  const [data, setData] = useState<User[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.USER_API_URL}`)
        setData(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { data, loading, error };
};

export default useFetchAllUsers