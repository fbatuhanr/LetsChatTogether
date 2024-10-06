export interface UserProps {
  username: string;
  password: string;
}
export interface DecodedUserProps {
  userId: string;
  username: string;
  exp?: number;
  iat?: number;
}
export interface LoginResponseProps {
  accessToken: string;
  refreshToken: string;
}
