import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from "./reducers/authSlice";
import productsReducer from "./reducers/productsSlice";

// Create a root reducer by combining your slices
const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
});

// Configuration for Redux Persist
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  // Optionally, you can whitelist specific reducers:
  whitelist: ["auth", "products"],
};

// Wrap your root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

// Create the persistor which will be used in your app entry point
export const persistor = persistStore(store);

export type StoreState = ReturnType<typeof store.getState>;
