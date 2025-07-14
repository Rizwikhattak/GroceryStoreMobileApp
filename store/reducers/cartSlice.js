// Updated cartSlice.js with support for editing finalized items

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

      console.log("Cart update:", {
        productId: id,
        selectedSizeId,
        change,
        itemName: item?.name,
      });

      // Create a unique key for the product variant combination
      const productKey = `${id}_${selectedSizeId || "no_variant"}`;

      console.log("Product Key", productKey);

      // Find existing active (non-finalized) item with the same product and variant
      let existingActiveItemIndex = -1;
      let existingFinalizedItemIndex = -1;

      if (item?.selectedVariant && item?.selectedVariant?.length > 0) {
        // For products with variations
        existingActiveItemIndex = state.data.findIndex(
          (cartItem) =>
            cartItem._id === id &&
            cartItem.selectedVariant?.[0]?._id === selectedSizeId &&
            !cartItem.isFinalized // Only find non-finalized items
        );

        existingFinalizedItemIndex = state.data.findIndex(
          (cartItem) =>
            cartItem._id === id &&
            cartItem.selectedVariant?.[0]?._id === selectedSizeId &&
            cartItem.isFinalized // Find finalized items
        );
      } else {
        // For products without variations
        existingActiveItemIndex = state.data.findIndex(
          (cartItem) => cartItem._id === id && !cartItem.isFinalized
        );

        existingFinalizedItemIndex = state.data.findIndex(
          (cartItem) => cartItem._id === id && cartItem.isFinalized
        );
      }

      console.log("Found existing active item index:", existingActiveItemIndex);
      console.log(
        "Found existing finalized item index:",
        existingFinalizedItemIndex
      );

      if (existingActiveItemIndex === -1) {
        // No existing active item found
        if (change > 0) {
          // Only add if change is positive
          const newItem = {
            ...item,
            orderQuantity: change,
            isFinalized: false,
            // Generate a unique key for cart items
            cartItemId: `${productKey}_${Date.now()}`,
            addedAt: new Date().toISOString(),
            // Store reference to finalized item if it exists
            linkedFinalizedItemId:
              existingFinalizedItemIndex !== -1
                ? state.data[existingFinalizedItemIndex].cartItemId
                : null,
          };
          console.log("Adding new item to cart:", newItem);
          state.data.push(newItem);
        }
      } else {
        // Existing active item found, update its quantity
        const currentQuantity =
          state.data[existingActiveItemIndex].orderQuantity || 0;
        const newQuantity = currentQuantity + change;

        console.log(
          `Updating quantity: ${currentQuantity} + ${change} = ${newQuantity}`
        );

        if (newQuantity <= 0) {
          // Remove item if quantity becomes 0 or negative
          console.log("Removing item from cart");
          state.data.splice(existingActiveItemIndex, 1);
        } else {
          // Update quantity and notes
          state.data[existingActiveItemIndex].orderQuantity = newQuantity;
          if (item?.product_note) {
            state.data[existingActiveItemIndex].product_note =
              item.product_note;
          }
          // Update timestamp
          state.data[existingActiveItemIndex].updatedAt =
            new Date().toISOString();
        }
      }

      console.log("Cart state after update:", {
        totalItems: state.data.length,
        items: state.data.map((item) => ({
          name: item.name,
          quantity: item.orderQuantity,
          finalized: item.isFinalized,
          cartItemId: item.cartItemId,
        })),
      });
    },
    updateFinalizedProductsQuantity: (state, action) => {
      const { id, change, item, selectedSizeId, cartItemId } = action.payload;

      console.log("Finalized product update:", {
        productId: id,
        selectedSizeId,
        change,
        itemName: item?.name,
        cartItemId,
      });

      let existingFinalizedItemIndex = -1;

      // Find the specific finalized item to update
      if (cartItemId) {
        // Find by specific cart item ID (most precise)
        existingFinalizedItemIndex = state.data.findIndex(
          (cartItem) =>
            cartItem.cartItemId === cartItemId && cartItem.isFinalized
        );
      } else if (item?.selectedVariant && item?.selectedVariant?.length > 0) {
        // For products with variations
        existingFinalizedItemIndex = state.data.findIndex(
          (cartItem) =>
            cartItem._id === id &&
            cartItem.selectedVariant?.[0]?._id === selectedSizeId &&
            cartItem.isFinalized // Only find finalized items
        );
      } else {
        // For products without variations
        existingFinalizedItemIndex = state.data.findIndex(
          (cartItem) => cartItem._id === id && cartItem.isFinalized
        );
      }

      console.log(
        "Found existing finalized item index:",
        existingFinalizedItemIndex
      );

      if (existingFinalizedItemIndex !== -1) {
        // Finalized item found, update its quantity
        const currentQuantity =
          state.data[existingFinalizedItemIndex].orderQuantity || 0;
        const newQuantity = currentQuantity + change;

        console.log(
          `Updating finalized item quantity: ${currentQuantity} + ${change} = ${newQuantity}`
        );

        if (newQuantity <= 0) {
          // Remove finalized item if quantity becomes 0 or negative
          console.log("Removing finalized item from cart");
          state.data.splice(existingFinalizedItemIndex, 1);
        } else {
          // Update quantity and timestamp for finalized item
          state.data[existingFinalizedItemIndex].orderQuantity = newQuantity;
          state.data[existingFinalizedItemIndex].updatedAt =
            new Date().toISOString();

          // Update notes if provided
          if (item?.product_note) {
            state.data[existingFinalizedItemIndex].product_note =
              item.product_note;
          }
        }
      } else {
        // No finalized item found - this shouldn't happen in normal cart page usage
        console.warn("No finalized item found to update:", {
          productId: id,
          selectedSizeId,
          cartItemId,
        });
      }

      console.log("Cart state after finalized update:", {
        totalItems: state.data.length,
        finalizedItems: state.data.filter((item) => item.isFinalized).length,
        items: state.data.map((item) => ({
          name: item.name,
          quantity: item.orderQuantity,
          finalized: item.isFinalized,
          cartItemId: item.cartItemId,
        })),
      });
    },

    // Add item to cart (alternative method for explicit adding)
    addToCart: (state, action) => {
      const { item, quantity = 1, selectedSizeId } = action.payload;

      // Create a unique key for the product variant combination
      const productKey = `${item._id}_${selectedSizeId || "no_variant"}`;

      // Check if item already exists in cart (non-finalized)
      let existingActiveItemIndex = -1;
      let existingFinalizedItemIndex = -1;

      if (selectedSizeId) {
        existingActiveItemIndex = state.data.findIndex(
          (cartItem) =>
            cartItem._id === item._id &&
            cartItem.selectedVariant?.[0]?._id === selectedSizeId &&
            !cartItem.isFinalized
        );

        existingFinalizedItemIndex = state.data.findIndex(
          (cartItem) =>
            cartItem._id === item._id &&
            cartItem.selectedVariant?.[0]?._id === selectedSizeId &&
            cartItem.isFinalized
        );
      } else {
        existingActiveItemIndex = state.data.findIndex(
          (cartItem) => cartItem._id === item._id && !cartItem.isFinalized
        );

        existingFinalizedItemIndex = state.data.findIndex(
          (cartItem) => cartItem._id === item._id && cartItem.isFinalized
        );
      }

      if (existingActiveItemIndex !== -1) {
        // Item exists, increase quantity
        state.data[existingActiveItemIndex].orderQuantity += quantity;
        state.data[existingActiveItemIndex].updatedAt =
          new Date().toISOString();
      } else {
        // Item doesn't exist, add new
        const newItem = {
          ...item,
          orderQuantity: quantity,
          isFinalized: false,
          cartItemId: `${productKey}_${Date.now()}`,
          addedAt: new Date().toISOString(),
          // Store reference to finalized item if it exists
          linkedFinalizedItemId:
            existingFinalizedItemIndex !== -1
              ? state.data[existingFinalizedItemIndex].cartItemId
              : null,
        };
        state.data.push(newItem);
      }
    },

    // Update product notes for active (non-finalized) items only
    updateCartItemNotes: (state, action) => {
      const { id, selectedSizeId, notes, cartItemId } = action.payload;

      let itemIndex = -1;

      if (cartItemId) {
        // Find by specific cart item ID
        itemIndex = state.data.findIndex(
          (cartItem) =>
            cartItem.cartItemId === cartItemId && !cartItem.isFinalized
        );
      } else if (selectedSizeId) {
        itemIndex = state.data.findIndex(
          (cartItem) =>
            cartItem._id === id &&
            cartItem.selectedVariant?.[0]?._id === selectedSizeId &&
            !cartItem.isFinalized
        );
      } else {
        itemIndex = state.data.findIndex(
          (cartItem) => cartItem._id === id && !cartItem.isFinalized
        );
      }

      if (itemIndex !== -1) {
        state.data[itemIndex].product_note = {
          product_id: id,
          note: notes,
        };
        state.data[itemIndex].updatedAt = new Date().toISOString();
        console.log("Notes updated for active cart item");
      }
    },

    // Enhanced finalize function that merges with existing finalized items
    finalizeCartItem: (state, action) => {
      const { id, selectedSizeId, cartItemId } = action.payload;

      let activeItemIndex = -1;

      if (cartItemId) {
        activeItemIndex = state.data.findIndex(
          (cartItem) =>
            cartItem.cartItemId === cartItemId && !cartItem.isFinalized
        );
      } else if (selectedSizeId) {
        activeItemIndex = state.data.findIndex(
          (cartItem) =>
            cartItem._id === id &&
            cartItem.selectedVariant?.[0]?._id === selectedSizeId &&
            !cartItem.isFinalized
        );
      } else {
        activeItemIndex = state.data.findIndex(
          (cartItem) => cartItem._id === id && !cartItem.isFinalized
        );
      }

      if (activeItemIndex !== -1) {
        const activeItem = state.data[activeItemIndex];

        // Check if there's a linked finalized item
        if (activeItem.linkedFinalizedItemId) {
          const finalizedItemIndex = state.data.findIndex(
            (cartItem) =>
              cartItem.cartItemId === activeItem.linkedFinalizedItemId
          );

          if (finalizedItemIndex !== -1) {
            // Merge quantities with existing finalized item
            state.data[finalizedItemIndex].orderQuantity +=
              activeItem.orderQuantity;
            state.data[finalizedItemIndex].updatedAt = new Date().toISOString();

            // Remove the active item since we merged it
            state.data.splice(activeItemIndex, 1);

            console.log("Merged active item with existing finalized item");
            return;
          }
        }

        // No existing finalized item to merge with, just finalize the current item
        state.data[activeItemIndex].isFinalized = true;
        state.data[activeItemIndex].finalizedAt = new Date().toISOString();
        // Remove the linked reference since this is now finalized
        delete state.data[activeItemIndex].linkedFinalizedItemId;

        console.log("Cart item finalized");
      }
    },

    // Remove specific cart item (can target finalized or active items)
    removeCartItem: (state, action) => {
      const {
        id,
        selectedSizeId,
        cartItemId,
        removeFinalized = false,
      } = action.payload;

      let itemIndex = -1;

      if (cartItemId) {
        // Remove by specific cart item ID
        itemIndex = state.data.findIndex(
          (item) => item.cartItemId === cartItemId
        );
      } else {
        // Remove by product ID and variant
        if (selectedSizeId) {
          itemIndex = state.data.findIndex(
            (cartItem) =>
              cartItem._id === id &&
              cartItem.selectedVariant?.[0]?._id === selectedSizeId &&
              (removeFinalized || !cartItem.isFinalized)
          );
        } else {
          itemIndex = state.data.findIndex(
            (cartItem) =>
              cartItem._id === id && (removeFinalized || !cartItem.isFinalized)
          );
        }
      }

      if (itemIndex !== -1) {
        state.data.splice(itemIndex, 1);
        console.log("Cart item removed");
      }
    },

    // Clear all finalized items (useful for checkout process)
    clearFinalizedItems: (state) => {
      state.data = state.data.filter((item) => !item.isFinalized);
      console.log("Finalized items cleared from cart");
    },

    // Reset entire cart
    resetCartState: (state) => {
      state.isLoading = false;
      state.data = [];
      state.pagination = {};
      state.error = null;
    },

    // Set loading state
    setCartLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Set cart error
    setCartError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.isLoading = false;
      state.data = [];
      state.pagination = {};
      state.error = null;
    });
  },
});

// Enhanced selectors for better cart data access
export const cartSelectors = {
  // Get total quantity for a specific product (including all variants and finalized items)
  getTotalProductQuantity: (
    state,
    productId,
    selectedSizeId = null,
    includeFinalized = true
  ) => {
    let items = [];
    if (selectedSizeId) {
      items = state.cart.data.filter(
        (cartItem) =>
          cartItem._id === productId &&
          cartItem.selectedVariant?.[0]?._id === selectedSizeId &&
          (includeFinalized || !cartItem.isFinalized)
      );
    } else {
      items = state.cart.data.filter(
        (cartItem) =>
          cartItem._id === productId &&
          (includeFinalized || !cartItem.isFinalized)
      );
    }

    return items.reduce((total, item) => total + (item.orderQuantity || 0), 0);
  },

  // Get only active (non-finalized) quantity for a specific product
  getActiveProductQuantity: (state, productId, selectedSizeId = null) => {
    let items = [];
    if (selectedSizeId) {
      items = state.cart.data.filter(
        (cartItem) =>
          cartItem._id === productId &&
          cartItem.selectedVariant?.[0]?._id === selectedSizeId &&
          !cartItem.isFinalized
      );
    } else {
      items = state.cart.data.filter(
        (cartItem) => cartItem._id === productId && !cartItem.isFinalized
      );
    }

    return items.reduce((total, item) => total + (item.orderQuantity || 0), 0);
  },

  // Get finalized quantity for a specific product
  getFinalizedProductQuantity: (state, productId, selectedSizeId = null) => {
    let items = [];
    if (selectedSizeId) {
      items = state.cart.data.filter(
        (cartItem) =>
          cartItem._id === productId &&
          cartItem.selectedVariant?.[0]?._id === selectedSizeId &&
          cartItem.isFinalized
      );
    } else {
      items = state.cart.data.filter(
        (cartItem) => cartItem._id === productId && cartItem.isFinalized
      );
    }

    return items.reduce((total, item) => total + (item.orderQuantity || 0), 0);
  },

  // Get total cart items count
  getTotalCartItemsCount: (state) => {
    return state.cart.data.reduce(
      (total, item) => total + (item.orderQuantity || 0),
      0
    );
  },

  // Get cart subtotal
  getCartSubtotal: (state) => {
    return state.cart.data.reduce(
      (total, item) => total + item.sale_price * item.orderQuantity,
      0
    );
  },

  // Get active (non-finalized) cart items
  getActiveCartItems: (state) => {
    return state.cart.data.filter((item) => !item.isFinalized);
  },

  // Get finalized cart items
  getFinalizedCartItems: (state) => {
    return state.cart.data.filter((item) => item.isFinalized);
  },

  // Check if a product has both active and finalized items (useful for UI)
  hasActiveAndFinalizedItems: (state, productId, selectedSizeId = null) => {
    const activeQty = cartSelectors.getActiveProductQuantity(
      state,
      productId,
      selectedSizeId
    );
    const finalizedQty = cartSelectors.getFinalizedProductQuantity(
      state,
      productId,
      selectedSizeId
    );

    return activeQty > 0 && finalizedQty > 0;
  },
};

export const {
  updateCartQuantity,
  addToCart,
  updateCartItemNotes,
  finalizeCartItem,
  removeCartItem,
  clearFinalizedItems,
  resetCartState,
  setCartLoading,
  setCartError,
  updateFinalizedProductsQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
