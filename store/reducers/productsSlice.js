import { createSlice } from "@reduxjs/toolkit";
import { getFeaturedProducts } from "../actions/productsSlice";
const initialState = {
  isLoading: false,
  data: [],
  pagination: {},
  error: null,
};
const productsSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeaturedProducts.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.data = action.payload.list;
        state.pagination = action.payload.pagination;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});
export default productsSlice.reducer;
