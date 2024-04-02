import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface IUser {
    token: string
    id: string
    username: string
}
const initialState: IUser = {
    token: "",
    id: "",
    username: ""
}

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            state.token = action.payload.token
            state.id = action.payload.id
            state.username = action.payload.username
        },
        clearUser: (state) => {
            state.token = ""
            state.id = ""
            state.username = ""
            console.log("clear")
        }
    }
})

export const { setUser, clearUser } = UserSlice.actions
export default UserSlice.reducer