import { useState, useEffect } from 'react'
import useAxios from '../useAxios'
import { UserProps } from '../../types/User.types'
import { useDecodedToken } from '../useDecodedToken';

const useSearchUsers = (query: string, page: number, limit: number) => {
    
    const axiosInstance = useAxios();

    const decodedToken = useDecodedToken()
    const [users, setUsers] = useState<UserProps[] | null>(null)

    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {

        const controller = new AbortController()
        const signal = controller.signal

        const fetchUsers = async () => {
            setLoading(true)
            try {
                const response = await axiosInstance.get(`${process.env.USER_API_URL}/search`, {
                    params: { query, page, limit, currUserId: decodedToken.userId },
                    signal
                })
                setUsers(response.data.users);
                setTotalPages(response.data.totalPages)
            } catch (err) {
                if (signal.aborted) {
                    console.log("cancelled!")
                    return
                }
                setError(err as Error)
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()

        return () => {
            controller.abort();
        }
    }, [query, page, limit])

    return { users, totalPages, loading, error }
}

export default useSearchUsers