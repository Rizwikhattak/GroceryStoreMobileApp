import { createSlice } from "@reduxjs/toolkit";
import {
  getAllFeaturedProducts,
  getAllProducts,
  getFeaturedProducts,
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
  reducers: {
    updateCartQuantity: (state, action) => {
      const { id, change, item } = action.payload;

      const itemIndex = state.cartState.findIndex((item) => item._id === id);
      if (itemIndex === -1) {
        state.cartState.push({ orderQuantity: change, ...item });
      }
      // else if (change === 0) {
      //   state.cartState.splice(itemIndex, 1);
      // }
      else {
        state.cartState[itemIndex].orderQuantity += change;
        if (state.cartState[itemIndex].orderQuantity === 0) {
          state.cartState.splice(itemIndex, 1);
        }
      }
      // state.cartState = state.cartState
      //   .map((item) => {
      //     if (item.id === id) {
      //       return {
      //         ...item,
      //         quantity: item.quantity + change,
      //       };
      //     }
      //     return item;
      //   })
      //   .filter((item) => item.quantity > 0);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        const data = action.payload.list;
        state.data = data;
        // state.data = data.filter(
        //   (item, index) =>
        //     item._id !== "66c835b2989abcf543ea9693" &&
        //     item._id !== "66c855776e4212fbdec483d2"
        // );
        state.pagination = action.payload.pagination;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getFeaturedProducts.pending, (state, action) => {
        state.featuredProducts.isLoading = true;
        state.featuredProducts.error = null;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        const data = action.payload.list;

        state.featuredProducts.data = data.filter(
          (item, index) =>
            item._id !== "66c835b2989abcf543ea9693" &&
            item._id !== "66c855776e4212fbdec483d2"
        );
        state.featuredProducts.pagination = action.payload.pagination;
        state.featuredProducts.isLoading = false;
        state.featuredProducts.error = null;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.featuredProductsisLoading = false;
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
export const { updateCartQuantity } = productsSlice.actions;
export default productsSlice.reducer;
