import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface IUser {
    user: any
}
const initialState: IUser = {
    user: {}
}

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
        },
        clearUserData: (state) => {
            state.user = {};
        }
    }
})

export const { setUser, clearUserData } = UserSlice.actions
export default UserSlice.reducer