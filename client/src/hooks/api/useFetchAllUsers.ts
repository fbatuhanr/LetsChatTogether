/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import useAxios from '../useAxios';
import { UserProps } from '../../types/User.types';

const useFetchAllUsers = (page: number, limit: number) => {

  const axiosInstance = useAxios();

  const [users, setUsers] = useState<UserProps[] | null>(null);

  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`${process.env.USER_API_URL}?page=${page}&limit=${limit}`)
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages)
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, limit]);

  return { users, totalPages, loading, error };
};

export default useFetchAllUsers