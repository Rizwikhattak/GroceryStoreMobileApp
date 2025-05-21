import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  data: [],
  pagination: {},
  error: null,
  data: [],
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
  },
});
export const { updateCartQuantity } = cartSlice.actions;
export default cartSlice.reducer;
