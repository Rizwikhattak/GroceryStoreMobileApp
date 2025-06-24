/* app/_layout.tsx --------------------------------------------------------- */
import React, { useCallback, useEffect } from "react";
import { Platform, UIManager } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router/stack";

import { Provider, useDispatch } from "react-redux";
import { persistor, store } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";

import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Buffer } from "buffer";

import ToastManager from "toastify-react-native";
import { StatusBar } from "expo-status-bar";

import { checkAuthStatus } from "@/store/actions/authActions";

// ---------------------------------------------------------------------
// Enable LayoutAnimation on Android (nice little UX boost for lists)
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Keep SplashScreen visible until we’re ready
// SplashScreen.preventAutoHideAsync().catch(() => {});

global.Buffer = Buffer; // polyfill for some libs that need Buffer

/* ------------------------- Wrapper to use Redux hooks ------------------ */
function AppContent() {
  const dispatch = useDispatch();

  // 👉 1. Load custom fonts (optional – remove if you don’t use them)
  const [fontsLoaded] = useFonts({
    // eg. "Inter-Black": require("../assets/fonts/Inter-Black.ttf"),
  });

  // 👉 2. Kick off auth status check once
  useEffect(() => {
    dispatch<any>(checkAuthStatus());
  }, [dispatch]);

  // 👉 3. Hide splash once fonts + redux are ready
  // const onReady = useCallback(async () => {
  //   if (fontsLoaded) await SplashScreen.hideAsync();
  // }, [fontsLoaded]);

  return (
    <>
      {/* Native-stack now owns all global routes & animations */}
      <StatusBar style="dark" translucent={true} backgroundColor="white" />
      <Stack
        screenOptions={{
          animation: "slide_from_right",
          animationDuration: 280,
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      >
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
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
      </Stack>

      {/* Toasts are rendered once at root so every screen can trigger them */}
      {/* <ToastManager /> */}
      {/* <StatusBar style="auto" /> */}
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

// _layout.tsx or RootLayout.tsx
// import { Drawer } from "expo-router/drawer";
// import "./globals.css";
// import { Provider, useDispatch, useSelector } from "react-redux";
// import "react-native-gesture-handler";
// import { persistor, store } from "../store/store";
// import "react-native-svg";
// import { useEffect } from "react";
// import { PersistGate } from "redux-persist/integration/react";
// import { checkAuthStatus } from "@/store/actions/authActions";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as SplashScreen from "expo-splash-screen";
// import { useFonts } from "expo-font";
// import { Buffer } from "buffer";
// import { StatusBar } from "expo-status-bar";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { Platform, UIManager } from "react-native";
// import Toast from "react-native-toast-message";
// import { toastConfig } from "@/components/ui/CustomToast";
// import CustomDrawerContent from "@/components/ui/CustomDrawer";
// import { Stack } from "expo-router";

// global.Buffer = Buffer;

// // Create a wrapper component to use Redux hooks
// function AppContent() {
//   const dispatch = useDispatch();
//   const isAuthenticated = useSelector(
//     (state: any) => state.auth.isAuthenticated
//   );
//   const auth = useSelector((state: any) => state.auth);
//   console.log("Auth state in _layout.tsx:", auth);
//   useEffect(() => {
//     // Check authentication status when the app loads
//     dispatch(checkAuthStatus());
//   }, [dispatch]);

//   // If user is not authenticated, show auth screens without drawer
//   if (!isAuthenticated) {
//     return (
//       <>
//         <StatusBar style="dark" translucent={true} backgroundColor="white" />
//         <Stack
//           screenOptions={{
//             animation: "slide_from_right",
//             animationDuration: 280,
//             gestureEnabled: true,
//             gestureDirection: "horizontal",
//           }}
//         >
//           <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//         </Stack>
//       </>
//     );
//   }

//   // If user is authenticated, show main app with drawer
//   return (
//     <>
//       <StatusBar style="dark" translucent={true} backgroundColor="white" />
//       <Drawer
//         drawerContent={CustomDrawerContent}
//         screenOptions={{
//           headerShown: false, // We'll use custom navbar
//           drawerStyle: {
//             width: "80%",
//           },
//           overlayColor: "rgba(0, 0, 0, 0.5)",
//           drawerActiveTintColor: "#8B1538",
//           drawerInactiveTintColor: "#666",
//         }}
//       >
//         {/* Main tabs screen */}
//         <Drawer.Screen
//           name="(tabs)"
//           options={{
//             headerShown: false,
//             drawerLabel: "Home",
//             title: "Home",
//           }}
//         />

//         {/* Individual screens that should be accessible from drawer */}
//         <Drawer.Screen
//           name="Category"
//           options={{
//             headerShown: false,
//             drawerLabel: "Categories",
//             title: "Categories",
//           }}
//         />
//         <Drawer.Screen
//           name="ContactUs"
//           options={{
//             headerShown: false,
//             drawerLabel: "Contact Us",
//             title: "Contact Us",
//           }}
//         />
//         <Drawer.Screen
//           name="AboutUs"
//           options={{
//             headerShown: false,
//             drawerLabel: "About Us",
//             title: "About Us",
//           }}
//         />

//         {/* Screens that shouldn't be in drawer but need to be accessible */}
//         <Drawer.Screen
//           name="CheckoutScreen"
//           options={{
//             headerShown: false,
//             drawerItemStyle: { display: "none" }, // Hide from drawer menu
//           }}
//         />
//         <Drawer.Screen
//           name="ProductDetailsPage"
//           options={{
//             headerShown: false,
//             drawerItemStyle: { display: "none" },
//           }}
//         />
//         <Drawer.Screen
//           name="TermsAndConditions"
//           options={{
//             headerShown: false,
//             drawerItemStyle: { display: "none" },
//           }}
//         />
//       </Drawer>
//     </>
//   );
// }

// export default function RootLayout() {
//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <GestureHandlerRootView style={{ flex: 1 }}>
//           <AppContent />
//           {/* Move Toast component here - at the root level */}
//           <Toast config={toastConfig} />
//         </GestureHandlerRootView>
//       </PersistGate>
//     </Provider>
//   );
// }
