import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import productsReducer from "./reducers/productsSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
  },
});

export type StoreState = ReturnType<typeof store.getState>;
