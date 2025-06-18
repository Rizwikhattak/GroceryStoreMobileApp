import { Stack } from "expo-router";
import "./globals.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import "react-native-gesture-handler";
import { persistor, store } from "../store/store";
import "react-native-svg";
import { useEffect } from "react";
import ToastManager from "toastify-react-native";
import { PersistGate } from "redux-persist/integration/react";
import { checkAuthStatus } from "@/store/actions/authActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
// AsyncStorage.removeItem("Authorization");
import CheckoutScreen from "@/app/CheckoutScreen";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Buffer } from "buffer";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform, UIManager } from "react-native";
global.Buffer = Buffer;
// Create a wrapper component to use Redux hooks
function AppContent() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  // AsyncStorage.removeItem("Authorization");

  useEffect(() => {
    // Check authentication status when the app loads
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const [fontsLoaded] = useFonts({
    "Optima-regular": require("../assets/fonts/OptimaLTPro-Medium.otf"),

    "Optima-bold": require("../assets/fonts/OptimaLTPro-Bold.otf"),

    "Optima-semi-bold": require("../assets/fonts/OptimaLTPro-DemiBold.otf"),

    "Optima-medium": require("../assets/fonts/OptimaLTPro-Medium.otf"),

    // "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Optionally render a loading indicator
  }
  return (
    <>
      <ToastManager />
      <StatusBar style="dark" translucent={true} backgroundColor="white" />

      <Stack
        screenOptions={{
          // “fade” feels snappy on both OSs; try 'slide_from_right' or 'none'
          animation: "slide_from_right", // preset
          animationDuration: 280, // ms
          gestureEnabled: true, // keeps swipes responsive
          gestureDirection: "horizontal",
        }}
      >
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
        <Stack.Screen name="CheckoutScreen" options={{ headerShown: false }} />
        <Stack.Screen
          name="ProductDetailsPage"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TermsAndConditions"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Category" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  // useEffect(() => {
  //   if (Platform.OS === "android") {
  //     UIManager.setLayoutAnimationEnabledExperimental(true);
  //   }
  // }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppContent />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
