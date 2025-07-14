import { createSlice } from "@reduxjs/toolkit";
import {
  getAllFeaturedProducts,
  getAllProducts,
  getFeaturedProducts,
  getProducts,
} from "../actions/productsActions";
const initialState = {
  isLoading: false,
  data: [],
  pagination: {},
  error: null,
  featuredProducts: {
    isLoading: false,
    data: [],
    pagination: {},
    error: null,
  },
  cartState: [],
  // cartState: new Map(),
};
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        // state.data = data.filter(
        //   (item, index) =>
        //     item._id !== "66c835b2989abcf543ea9693" &&
        //     item._id !== "66c855776e4212fbdec483d2"
        // );
        const data = action.payload.list;
        state.data = data;
        state.pagination = action.payload.pagination;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getProducts.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        const data = action.payload.list;
        state.data = data;
        state.pagination = action.payload.pagination;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.data = [];
        state.error = action.payload;
      })

      .addCase(getFeaturedProducts.pending, (state, action) => {
        state.featuredProducts.isLoading = true;
        state.featuredProducts.error = null;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        const data = action.payload.list;
        state.featuredProducts.data = data;
        // state.featuredProducts.data = data.filter(
        //   (item, index) =>
        //     item._id !== "66c835b2989abcf543ea9693" &&
        //     item._id !== "66c855776e4212fbdec483d2"
        // );

        state.featuredProducts.pagination = action.payload.pagination;
        state.featuredProducts.isLoading = false;
        state.featuredProducts.error = null;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.featuredProducts.error = action.payload;
      })
      .addCase(getAllFeaturedProducts.pending, (state, action) => {
        state.featuredProducts.isLoading = true;
        state.featuredProducts.error = null;
      })
      .addCase(getAllFeaturedProducts.fulfilled, (state, action) => {
        const data = action.payload.list;
        state.featuredProducts.data = data;
        // state.featuredProducts.data = data.filter(
        //   (item, index) =>
        //     item._id !== "66c835b2989abcf543ea9693" &&
        //     item._id !== "66c855776e4212fbdec483d2"
        // );

        state.featuredProducts.pagination = action.payload.pagination;
        state.featuredProducts.isLoading = false;
        state.featuredProducts.error = null;
      })
      .addCase(getAllFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.featuredProducts.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
