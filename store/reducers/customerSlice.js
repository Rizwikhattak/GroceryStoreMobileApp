import { getCustomerDetails } from "@/store/actions/customerActions";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: null,
  data: {},
};

const customerSlice = createSlice({
  name: "customer",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCustomerDetails.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCustomerDetails.fulfilled, (state, action) => {
        state.data = action.payload?.item || {};
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getCustomerDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = null;
      });
  },
});

export default customerSlice.reducer;
