"use client";

import { View, Image, Pressable, Keyboard, Platform } from "react-native";
import { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { icons } from "@/constants/icons";
import { primary } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
// import ProtectedRoute from "@/components/ProtectedRoute";

const TabIcon = ({
  focused,
  icon,
  title,
  customViewStyle = "",
  customIconStyle = "",
  customTintColor = "#c5c5c5",
}: any) => {
  if (focused) {
    return (
      <View
        className={`size-full justify-center items-center mt-4 rounded-full ${customViewStyle}`}
      >
        <Image
          source={icon}
          // tintColor="#4ab7b6"
          tintColor={title === "Cart" ? "#ffff" : primary}
          className={`${
            title === "Home" ? "h-10 w-10" : "size-7"
          } ${customIconStyle}`}
        />
      </View>
    );
  }
  return (
    <View
      className={`size-full justify-center items-center mt-4 rounded-full ${customViewStyle}`}
    >
      <Image
        source={icon}
        tintColor={customTintColor}
        className={`size-5 ${customIconStyle}`}
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
          tabBarItemStyle: {
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          },
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
                customIconStyle="size-8"
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
                customViewStyle="bg-[#ef4444] h-20 w-20 absolute -top-16 z-10 border-4 border-light-100 shadow-lg"
                customIconStyle="size-9"
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

export default _layout;
