import { placeCustomerOrder } from "@/store/actions/orderActions";
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
      });
  },
});
export default orderSlice.reducer;
