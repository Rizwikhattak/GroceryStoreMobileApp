import {
  getUserProfileDetails,
  getNotifications,
  updateUserProfileDetails,
  getCustomerOrders,
} from "@/store/actions/settingsActions";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isPostLoading: false,
  data: {},
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
      })
      .addCase(getCustomerOrders.pending, (state, action) => {
        state.orders.isLoading = true;
        state.orders.error = null;
      })
      .addCase(getCustomerOrders.fulfilled, (state, action) => {
        const data = action.payload.list;
        state.orders.data = data;
        state.orders.pagination = action.payload.pagination;
        state.orders.isLoading = false;
        state.orders.error = null;
      })
      .addCase(getCustomerOrders.rejected, (state, action) => {
        state.orders.isLoading = false;
        state.orders.error = action.payload;
      })
      .addCase(getUserProfileDetails.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfileDetails.fulfilled, (state, action) => {
        state.data = action.payload?.item || {};
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getUserProfileDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateUserProfileDetails.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfileDetails.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
      })
      .addCase(updateUserProfileDetails.rejected, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
      });
  },
});
export default settingsSlice.reducer;
