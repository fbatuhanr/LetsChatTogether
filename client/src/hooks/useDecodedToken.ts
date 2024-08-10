import { useAppSelector } from '../redux/hooks'
import { jwtDecode } from 'jwt-decode'
import { defaultDecodedToken } from '../constants/defaultValues'
import { DecodedToken } from '../types/DecodedToken'

export const useDecodedToken = () => {
    
    const auth = useAppSelector((state) => state.auth);

    try {
        return auth?.accessToken
            ? jwtDecode<DecodedToken>(auth.accessToken)
            : defaultDecodedToken;

    } catch (error) {

        console.error('Error decoding token:', error);
        return defaultDecodedToken;
    }
}