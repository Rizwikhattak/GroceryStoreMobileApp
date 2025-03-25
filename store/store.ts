import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSltce";
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type StoreState = ReturnType<typeof store.getState>;
