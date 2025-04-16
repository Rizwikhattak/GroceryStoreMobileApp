import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from "./reducers/authSlice";
import productsReducer from "./reducers/productsSlice";
import categoriesReducer from "./reducers/categoriesSlice";
import customerReducer from "./reducers/customerSlice";

// Create a root reducer by combining your slices
const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  categories: categoriesReducer,
  customers: customerReducer,
});

// Configuration for Redux Persist
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  // Optionally, you can whitelist specific reducers:
  whitelist: ["auth"],
};

// Wrap your root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with the middleware option to ignore specific Redux Persist actions
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types which contain non-serializable values.
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create the persistor which will be used in your app entry point
const persistor = persistStore(store);

export { store, persistor };
