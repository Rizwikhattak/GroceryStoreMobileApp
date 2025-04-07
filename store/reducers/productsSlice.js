import { createSlice } from "@reduxjs/toolkit";
import { getFeaturedProducts } from "../actions/productsActions";
const initialState = {
  isLoading: false,
  data: [],
  pagination: {},
  error: null,
  cartState: [],
};
const productsSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateCartQuantity: (state, action) => {
      const { id, change } = action.payload;
      const itemIndex = state.cartState.findIndex((item) => item.id === id);
      if (itemIndex === -1) {
        state.cartState.push({ id, quantity: change });
      } else if (change === 0) {
        state.cartState.splice(itemIndex, 1);
      } else {
        state.cartState[itemIndex].quantity += change;
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
export const { updateCartQuantity } = productsSlice.actions;
export default productsSlice.reducer;
