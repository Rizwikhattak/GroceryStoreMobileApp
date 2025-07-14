import {
  getCustomerOrderByID,
  placeCustomerOrder,
} from "@/store/actions/orderActions";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isPostLoading: false,
  data: {},
  pagination: {},
  error: null,
};
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeCustomerOrder.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(placeCustomerOrder.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
      })
      .addCase(placeCustomerOrder.rejected, (state, action) => {
        state.isPostLoading = false;
        state.error = action.payload;
      })
      .addCase(getCustomerOrderByID.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCustomerOrderByID.fulfilled, (state, action) => {
        console.log(action.payload);
        state.data = action.payload?.item;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getCustomerOrderByID.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});
export default orderSlice.reducer;
