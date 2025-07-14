import { placeCustomerOrder } from "@/store/actions/orderActions";
import {
  getPantryProducts,
  makeProductPantry,
} from "@/store/actions/pantryActions";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isPostLoading: false,
  data: [],
  pagination: {},
  error: null,
};
const pantrySlice = createSlice({
  name: "pantry",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(makeProductPantry.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(makeProductPantry.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
      })
      .addCase(makeProductPantry.rejected, (state, action) => {
        state.isPostLoading = false;
        state.error = action.payload;
      })
      .addCase(getPantryProducts.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPantryProducts.fulfilled, (state, action) => {
        const data = action.payload.list;
        state.data = data;
        state.pagination = action.payload.pagination;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getPantryProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});
export default pantrySlice.reducer;
