/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import useAxios from "../useAxios";
import { UserProps } from "../../types/User.types";
import { useDecodedToken } from "../useDecodedToken";

const useSearchUsers = (query: string, page: number, limit: number, sortOrder: string) => {
  const [isLoading, setIsLoading] = useState(true);

  const axiosInstance = useAxios();

  const decodedToken = useDecodedToken();

  const [users, setUsers] = useState<UserProps[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("user/search", {
          params: { query, page, limit, sortOrder, currUserId: decodedToken.userId },
          signal,
        });
        setUsers(response.data.users);
        setTotalUsers(response.data.totalUsers);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        if (signal.aborted) {
          // console.log("cancelled!");
          return;
        }
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();

    return () => {
      controller.abort();
    };
  }, [query, page, limit, sortOrder]);

  return { users, totalUsers, totalPages, isLoading, error };
};

export default useSearchUsers;
