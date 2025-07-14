/* app/_layout.tsx - Final solution using Redux Persist */
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Platform, UIManager, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../store/store";

import { Buffer } from "buffer";
import { useFonts } from "expo-font";

import { toastConfig } from "@/components/ui/CustomToast";
import { checkAuthStatus } from "@/store/actions/authActions";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

// Keep splash screen visible
// SplashScreen.preventAutoHideAsync();

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

global.Buffer = Buffer;

/* ------------------------- Loading Component ---------------------------- */
function LoadingComponent() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/images/premium-meats-logo.png")}
        style={{ width: 120, height: 120 }}
        resizeMode="contain"
      />
    </View>
  );
}

/* ------------------------- App Content with Redux ---------------------- */
function AppContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authSlice = useSelector((state: any) => state.auth);
  const [isAppReady, setIsAppReady] = useState(false);

  // Load fonts
  const [fontsLoaded] = useFonts({
    // your fonts here
  });

  // 👉 Check if we need to validate the persisted token
  useEffect(() => {
    const initializeAuth = async () => {
      if (authSlice.token) {
        // If we have a persisted token, validate it
        await dispatch<any>(checkAuthStatus());
      }
      // Always mark app as ready after initial check
      setIsAppReady(true);
    };

    initializeAuth();
  }, [dispatch]);

  // 👉 Handle navigation after everything is ready
  useEffect(() => {
    if (
      fontsLoaded &&
      !authSlice.isLoading &&
      (isAppReady || authSlice.hasCheckedAuth)
    ) {
      const navigateToApp = async () => {
        // Hide splash screen
        // await SplashScreen.hideAsync();

        // Navigate based on auth status
        if (authSlice.isAuthenticated) {
          router.replace("/(drawer)/(tabs)");
        } else {
          // router.replace("/(auth)");
        }
      };

      // Small delay for smooth transition
      navigateToApp();
    }
  }, [
    fontsLoaded,
    authSlice.isLoading,
    authSlice.isAuthenticated,
    authSlice.hasCheckedAuth,
    isAppReady,
    router,
  ]);

  // Show loading while app is initializing
  // if (
  //   !fontsLoaded ||
  //   authSlice.isLoading ||
  //   (!isAppReady && !authSlice.hasCheckedAuth)
  // ) {
  //   return <LoadingComponent />;
  // }

  return (
    <>
      <StatusBar style="dark" translucent={true} backgroundColor="white" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 200,
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      >
        {/* <Stack.Screen
          name="SplashScreen"
          options={{
            headerShown: false,
          }}
        /> */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="(drawer)" options={{ headerShown: false }} /> */}
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
        <Stack.Screen name="OrderDetails" options={{ headerShown: false }} />
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

/* ------------------------ Root Layout ----------------------------------- */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<LoadingComponent />} persistor={persistor}>
          <AppContent />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
