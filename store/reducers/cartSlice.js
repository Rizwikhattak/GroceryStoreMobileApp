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
      const { id, change, item, selectedSizeId } = action.payload;

      let itemIndex = -1;
      console.log(action.payload);
      console.log(
        "Cart update - Product ID:",
        id,
        "Selected Size ID:",
        selectedSizeId,
        "Change:",
        change
      );

      // Check if this product has variations/sizes
      if (item?.selectedVariant && item?.selectedVariant?.length > 0) {
        // For products with variations, find by both product ID and selected variant ID
        itemIndex = state.data.findIndex(
          (cartItem) =>
            cartItem._id === id &&
            cartItem.selectedVariant?.[0]?._id === selectedSizeId
        );
        console.log("Product with variations - Item index:", itemIndex);
      } else {
        // For products without variations, find by product ID only
        itemIndex = state.data.findIndex((cartItem) => cartItem._id === id);
        console.log("Product without variations - Item index:", itemIndex);
      }

      if (itemIndex === -1) {
        // Item not found in cart, add new item
        const newItem = {
          ...item,
          orderQuantity: Math.max(0, change), // Ensure quantity is not negative
        };
        console.log("Adding new item to cart:", newItem);
        state.data.push(newItem);
      } else {
        // Item found in cart, update quantity
        const currentQuantity = state.data[itemIndex].orderQuantity || 0;
        const newQuantity = currentQuantity + change;

        console.log(
          "Updating existing item - Current qty:",
          currentQuantity,
          "New qty:",
          newQuantity
        );

        if (newQuantity <= 0) {
          // Remove item if quantity becomes 0 or negative
          console.log("Removing item from cart");
          state.data.splice(itemIndex, 1);
        } else {
          // Update quantity
          state.data[itemIndex].orderQuantity = newQuantity;
        }
      }

      console.log("Cart state after update:", state.data.length, "items");
    },

    // Helper action to remove a specific item
    removeCartItem: (state, action) => {
      const { id, selectedSizeId } = action.payload;
      console.log(
        "Removing item - Product ID:",
        id,
        "Selected Size ID:",
        selectedSizeId
      );
      let itemIndex = -1;
      if (selectedSizeId) {
        // Remove specific size variant
        itemIndex = state.data.findIndex(
          (cartItem) =>
            cartItem._id === id &&
            cartItem.selectedVariant?.[0]?._id === selectedSizeId
        );
      } else {
        // Remove product without variations
        itemIndex = state.data.findIndex((cartItem) => cartItem._id === id);
      }
      console.log("Item index to remove:", itemIndex);
      if (itemIndex !== -1) {
        state.data.splice(itemIndex, 1);
      }
    },

    // Helper action to get cart item count for a specific product/size
    getCartItemQuantity: (state, action) => {
      const { id, selectedSizeId } = action.payload;

      let itemIndex = -1;
      if (selectedSizeId) {
        itemIndex = state.data.findIndex(
          (cartItem) =>
            cartItem._id === id &&
            cartItem.selectedVariant?.[0]?._id === selectedSizeId
        );
      } else {
        itemIndex = state.data.findIndex((cartItem) => cartItem._id === id);
      }

      return itemIndex !== -1 ? state.data[itemIndex].orderQuantity : 0;
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

export const {
  updateCartQuantity,
  removeCartItem,
  getCartItemQuantity,
  resetCartState,
} = cartSlice.actions;

export default cartSlice.reducer;
