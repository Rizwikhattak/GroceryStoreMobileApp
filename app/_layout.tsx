import { Stack } from "expo-router";
import "./globals.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import { persistor, store } from "../store/store";
import "react-native-svg";
import { useEffect } from "react";
import ToastManager from "toastify-react-native";
import { PersistGate } from "redux-persist/integration/react";
import { checkAuthStatus } from "@/store/actions/authActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckoutScreen from "@/app/CheckoutScreen";

// Create a wrapper component to use Redux hooks
function AppContent() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // AsyncStorage.removeItem("Authorization");

  useEffect(() => {
    // Check authentication status when the app loads
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <>
      <ToastManager />
      <Stack>
        {/* Redirect users based on authentication status */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
          redirect={!isAuthenticated}
        />
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
          redirect={isAuthenticated}
        />
        <Stack.Screen name="Checkout" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}
