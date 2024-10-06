/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setAccessToken, clearAccessToken } from "../redux/features/authSlice";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useAxios from "../hooks/useAxios";
import LoadingSpinner from "../components/LoadingSpinner";

interface WithAuthCheckProps {
  children?: React.ReactNode;
}
const withAuthCheck = <P extends WithAuthCheckProps>(
  WrappedComponent: React.FC<P>,
  shouldRedirectAuthenticated: boolean,
  redirectPath: string
) => {
  return (props: P) => {
    const axiosInstance = useAxios();
    const auth = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkTokenValidity = async () => {
        if (!auth.accessToken) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        try {
          const decodedJwt: { exp: number } = jwtDecode(auth.accessToken);
          const isTokenExpired = decodedJwt.exp * 1000 < Date.now();

          if (isTokenExpired) {
            console.log("Token has expired, refreshing...");
            const response = await axiosInstance.post("auth/refresh-token");

            if (response.status === 200) {
              dispatch(setAccessToken(response.data.accessToken));
              setIsAuthenticated(true);
            } else {
              console.log("Failed to obtain a new token!");
              throw new Error("Failed to obtain a new token!");
            }
          } else {
            setIsAuthenticated(true);
          }
        } catch (err) {
          console.error("Auth Verification Error:", err);
          dispatch(clearAccessToken());
          setIsAuthenticated(false);
        } finally {
          setIsLoading(false);
        }
      };

      checkTokenValidity();
    }, [auth.accessToken]);

    if (isLoading) return <LoadingSpinner />;
    if (isAuthenticated === shouldRedirectAuthenticated)
      return <Navigate to={redirectPath} />;

    return <WrappedComponent {...props} />;
  };
};

export default withAuthCheck;
