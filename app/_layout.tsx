import { Stack } from "expo-router";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "../store/store";
export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="/items/[id]" options={{ headerShown: false }} /> */}
      </Stack>
    </Provider>
  );
}
