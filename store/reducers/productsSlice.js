import { createSlice } from "@reduxjs/toolkit";
import { getFeaturedProducts } from "../actions/productsActions";
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
        const data = action.payload.list;

        state.data = data.filter(
          (item, index) =>
            item._id !== "66c835b2989abcf543ea9693" &&
            item._id !== "66c855776e4212fbdec483d2"
        );
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
