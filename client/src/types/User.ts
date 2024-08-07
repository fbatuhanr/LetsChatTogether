export interface User {
    _id: string,
    username: string,
    name: string,
    surname: string,
    gender: 'male' | 'female' | 'other',
    dateOfBirth?: Date,
    profilePhoto?: File | FileList | string | null,
    about?: string | null
}