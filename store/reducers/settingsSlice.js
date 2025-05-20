import { getNotifications } from "@/store/actions/settingsActions";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  data: [],
  pagination: {},
  error: null,
  orders: {
    isLoading: false,
    data: [],
    pagination: {},
    error: null,
  },
  notifications: {
    isLoading: false,
    data: [],
    pagination: {},
    error: null,
  },
};
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state, action) => {
        state.notifications.isLoading = true;
        state.notifications.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        const data = action.payload.list;
        state.notifications.data = data;
        state.notifications.pagination = action.payload.pagination;
        state.notifications.isLoading = false;
        state.notifications.error = null;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.notifications.isLoading = false;
        state.notifications.error = action.payload;
      });
  },
});
export default settingsSlice.reducer;
