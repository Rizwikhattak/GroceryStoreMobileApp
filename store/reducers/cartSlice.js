import { logout } from "@/store/reducers/authSlice";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  data: [],
  pagination: {},
  error: null,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateCartQuantity: (state, action) => {
      const { id, change, item } = action.payload;
      const itemIndex = state.data.findIndex((item) => item._id === id);
      if (itemIndex === -1) {
        state.data.push({ orderQuantity: change, ...item });
      } else {
        state.data[itemIndex].orderQuantity += change;
        if (state.data[itemIndex].orderQuantity === 0) {
          state.data.splice(itemIndex, 1);
        }
      }
    },
    resetCartState: (state, action) => {
      state.isLoading = false;
      state.data = [];
      state.pagination = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      // Reset cart when logout action is dispatched
      state.isLoading = false;
      state.data = [];
      state.pagination = {};
      state.error = null;
    });
  },
});

export const { updateCartQuantity, resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
