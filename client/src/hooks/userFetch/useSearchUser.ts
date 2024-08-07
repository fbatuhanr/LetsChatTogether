import { useState, useEffect } from 'react'
import useAxios from '../useAxios'
import { User } from '../../types/User'
import axios from 'axios'

const useSearchUsers = (query: string, page: number, limit: number) => {

    const [users, setUsers] = useState<User[] | null>(null)

    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const axiosInstance = useAxios();

    useEffect(() => {

        const controller = new AbortController()
        const signal = controller.signal

        const fetchUsers = async () => {
            setLoading(true)
            try {
                const response = await axiosInstance.get(`${process.env.USER_API_URL}/search`, {
                    params: { query, page, limit },
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
        };
        fetchUsers()

        return () => {
            controller.abort();
        }
    }, [query, page, limit])

    return { users, totalPages, loading, error }
}

export default useSearchUsers