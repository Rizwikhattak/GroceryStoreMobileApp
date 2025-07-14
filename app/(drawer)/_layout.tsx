// app/(drawer)/_layout.tsx
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/ui/CustomDrawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false, // We'll use custom navbar
          drawerStyle: {
            width: "80%",
          },
          overlayColor: "rgba(0, 0, 0, 0.5)",
          drawerActiveTintColor: "#8B1538",
          drawerInactiveTintColor: "#666",
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        {/* Main tabs screen */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Home",
            headerShown: false,
            drawerItemStyle: { display: "none" }, // Hide from default drawer
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
