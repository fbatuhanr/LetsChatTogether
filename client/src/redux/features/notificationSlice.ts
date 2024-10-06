import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  totalIncomingRequestCount: number;
  totalUnreadMessageCount: number;
}
const initialState: NotificationState = {
  totalIncomingRequestCount: 0,
  totalUnreadMessageCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationState>) => {
      state.totalIncomingRequestCount =
        action.payload.totalIncomingRequestCount;
      state.totalUnreadMessageCount = action.payload.totalUnreadMessageCount;
    },
    setIncomingRequestCount: (state, action: PayloadAction<number>) => {
      state.totalIncomingRequestCount = action.payload;
    },
    setUnreadMessageCount: (state, action: PayloadAction<number>) => {
      state.totalUnreadMessageCount = action.payload;
    },
    clearNotifications: () => {
      return initialState;
    },
  },
});

export const { setNotifications, clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
