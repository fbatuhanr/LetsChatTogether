import { useAppSelector } from '../redux/hooks'; // Kendi hook'larınızı doğru yoldan import edin
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../types/decodedToken';
import { defaultDecodedToken } from '../constants/defaultValues';

export const useDecodedToken = (): DecodedToken => {
    
    const auth = useAppSelector((state) => state.auth);

    try {
        return auth?.accessToken
            ? jwtDecode<DecodedToken>(auth.accessToken)
            : defaultDecodedToken;

    } catch (error) {

        console.error('Error decoding token:', error);
        return defaultDecodedToken;
    }
};
