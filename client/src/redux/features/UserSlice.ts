import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface IUser {
    token: string
    username: string
}
const initialState: IUser = {
    token: "",
    username: ""
}

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            state.token = action.payload.token
            state.username = action.payload.username
        },
        clearUser: (state) => {
            state.token = ""
            state.username = ""
            console.log("clear")
        }
    }
})

export const { setUser, clearUser } = UserSlice.actions
export default UserSlice.reducer