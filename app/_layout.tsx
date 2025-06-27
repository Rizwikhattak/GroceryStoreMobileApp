/* app/_layout.tsx - Corrected approach with proper routing --------------------------------------------------------- */
import React, { useCallback, useEffect } from "react";
import { Platform, Text, UIManager, View, Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router/stack";
import { useRouter } from "expo-router";

import { Provider, useDispatch, useSelector } from "react-redux";
import { persistor, store } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";

import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Buffer } from "buffer";

import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { checkAuthStatus } from "@/store/actions/authActions";
import LoadingScreen from "@/components/ui/LoadingSpinner";
import { toastConfig } from "@/components/ui/CustomToast";

// ---------------------------------------------------------------------
// Enable LayoutAnimation on Android (nice little UX boost for lists)
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

global.Buffer = Buffer; // polyfill for some libs that need Buffer

/* ------------------------- Wrapper to use Redux hooks ------------------ */
function AppContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authSlice = useSelector((state: any) => state.auth);

  // 👉 1. Load custom fonts (optional – remove if you don't use them)
  const [fontsLoaded] = useFonts({
    // eg. "Inter-Black": require("../assets/fonts/Inter-Black.ttf"),
  });

  // 👉 2. Kick off auth status check once
  useEffect(() => {
    dispatch<any>(checkAuthStatus());
  }, [dispatch]);

  // 👉 3. Handle navigation after auth check completes
  useEffect(() => {
    if (!authSlice.isLoading) {
      if (authSlice.isAuthenticated) {
        router.replace("/(drawer)");
      } else {
        router.replace("/(auth)");
      }
    }
  }, [authSlice.isLoading, authSlice.isAuthenticated, router]);

  // 👉 4. Show logo while checking auth status
  // if (authSlice.isLoading) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         backgroundColor: "white",
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >
  //       {/* Replace with your actual logo component or image */}
  //       <Image
  //         source={require("../assets/images/premium-meats-logo.png")} // Update path to your logo
  //         style={{ width: 120, height: 120 }}
  //         resizeMode="contain"
  //       />
  //     </View>
  //   );
  // }

  return (
    <>
      <StatusBar style="dark" translucent={true} backgroundColor="white" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 280,
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      >
        {/* Define all screens first */}
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(drawer)"
          options={{
            headerShown: false,
          }}
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
        <Stack.Screen name="AboutUs" options={{ headerShown: false }} />
        <Stack.Screen name="ContactUs" options={{ headerShown: false }} />
        <Stack.Screen name="SearchPage" options={{ headerShown: false }} />
        <Stack.Screen
          name="OrderConfirmation"
          options={{ headerShown: false }}
        />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
}

/* ------------------------ Root export with providers ------------------- */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContent />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
