// app/(drawer)/_layout.tsx
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/ui/CustomDrawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
  // 👇 GestureHandlerRootView is *only* needed once in your tree.
  // If you already wrap the root _layout.tsx with it, delete it here.
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        // screenOptions={{
        //   headerShown: false, // hide default RN header :contentReference[oaicite:0]{index=0}
        //   drawerType: "slide", // nice native slide drawer :contentReference[oaicite:1]{index=1}
        //   swipeEdgeWidth: 60, // optional: how far from edge swipe starts
        // }}
        screenOptions={{
          headerShown: false, // We'll use custom navbar
          drawerStyle: {
            width: "80%",
          },
          overlayColor: "rgba(0, 0, 0, 0.5)",
          drawerActiveTintColor: "#8B1538",
          drawerInactiveTintColor: "#666",
        }}
        drawerContent={(props) => (
          // your existing custom menu component
          <CustomDrawerContent {...props} />
        )}
      >
        {/* first screen inside drawer holds the bottom-tabs layout */}
        <Drawer.Screen name="(tabs)" options={{ drawerLabel: "Home" }} />
        {/* <Drawer.Screen name="AboutUs" options={{ drawerLabel: "Home" }} /> */}
        {/* <Drawer.Screen name="ContactUs" options={{ drawerLabel: "Home" }} /> */}

        {/* put any extra drawer-only pages below */}
        {/* <Drawer.Screen name="settings" options={{ drawerLabel: "Settings" }} /> */}
      </Drawer>
    </GestureHandlerRootView>
  );
}
