import { Stack } from "expo-router";
import "./globals.css";
import { Provider } from "react-redux";
import { persistor, store } from "../store/store";
import "react-native-svg";
import { useEffect } from "react";
import ToastManager from "toastify-react-native";
import { PersistGate } from "redux-persist/integration/react";
export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastManager />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </PersistGate>
    </Provider>
  );
}
