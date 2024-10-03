export interface UserProps {
    _id: string;
    username: string;
    email: string;
    name: string;
    surname: string;
    gender: 'male' | 'female' | 'other';
    dateOfBirth?: Date | undefined;
    profilePhoto?: File | FileList | string | null;
    about?: string | null;
}
export interface FriendProps {
  _id: string;
  username: string;
  profilePhoto?: string | null;
}