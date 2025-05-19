"use client";

import {
  View,
  Image,
  Pressable,
  Keyboard,
  Platform,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { icons } from "@/constants/icons";
import { primary } from "@/constants/colors";
import { StatusBar } from "expo-status-bar";
// import ProtectedRoute from "@/components/ProtectedRoute";

const TabIcon = ({
  focused,
  icon,
  title,
  customViewStyle = null,
  customIconStyle = null,
  customTintColor = "#c5c5c5",
}: any) => {
  if (focused) {
    return (
      <View
        style={[
          styles.tabIconContainer,
          customViewStyle && styles[customViewStyle],
        ]}
      >
        <Image
          source={icon}
          // tintColor="#4ab7b6"
          tintColor={title === "Cart" ? "#ffff" : primary}
          style={[
            title === "Home" ? styles.homeIcon : styles.icon,
            customIconStyle && styles[customIconStyle],
          ]}
        />
      </View>
    );
  }
  return (
    <View
      style={[
        styles.tabIconContainer,
        customViewStyle && styles[customViewStyle],
      ]}
    >
      <Image
        source={icon}
        tintColor={customTintColor}
        style={[styles.smallIcon, customIconStyle && styles[customIconStyle]]}
      />
    </View>
  );
};

const _layout = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Add keyboard listeners to detect when keyboard appears/disappears
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    // Clean up listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    // <ProtectedRoute>
    <>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarItemStyle: styles.tabBarItem,
          tabBarButton: (props) => (
            <Pressable
              {...props}
              android_ripple={{ color: "transparent" }} // Android: transparent ripple
            />
          ),
          tabBarStyle: {
            backgroundColor: "#ffffff",
            height: 52,
            position: "absolute",
            overflowX: "hidden",
            borderWidth: 1,
            // Hide the tab bar when keyboard is visible
            display: keyboardVisible ? "none" : "flex",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={icons.home}
                title="Home"
                customIconStyle="largeIcon"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={icons.dashboard}
                title="Dashboard"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            headerShown: false,
            tabBarStyle: {
              display: "none",
            },
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={icons.cart}
                title="Cart"
                customViewStyle="cartButton"
                customIconStyle="extraLargeIcon"
                customTintColor="#ffff"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="liked"
          options={{
            title: "Liked",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.heart} title="Liked" />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "profile",
            headerShown: false,
            tabBarStyle: {
              display: "none",
            },
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.profile} title="Profile" />
            ),
          }}
        />
      </Tabs>
    </>
    // </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16, // mt-4
    borderRadius: 9999, // rounded-full
  },
  homeIcon: {
    height: 40, // h-10
    width: 40, // w-10
  },
  icon: {
    width: 28, // size-7
    height: 28, // size-7
  },
  smallIcon: {
    width: 20, // size-5
    height: 20, // size-5
  },
  largeIcon: {
    width: 32, // size-8
    height: 32, // size-8
  },
  extraLargeIcon: {
    width: 36, // size-9
    height: 36, // size-9
  },
  cartButton: {
    backgroundColor: "#ef4444", // bg-[#ef4444]
    height: 80, // h-20
    width: 80, // w-20
    position: "absolute", // absolute
    top: -64, // -top-16
    zIndex: 10, // z-10
    borderWidth: 4, // border-4
    borderColor: "#f9fafb", // border-light-100
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10, // shadow-lg equivalent
  },
  tabBarItem: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default _layout;
