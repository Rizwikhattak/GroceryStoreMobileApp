import { View, Text, ImageBackground, Image, Pressable } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
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
          tintColor="#4ab7b6"
          className={`${
            title === "Home" ? "h-10 w-10" : "size-7"
          } ${customIconStyle}`}
        />
      </View>
      // <ImageBackground
      //   source={images.highlight}
      //   className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
      // >
      //   <Image source={icon} tintColor="#4ab7b6" className="size-5" />
      //   <Text className="text-secondary text-base font-semibold ml-2">
      //     {title}
      //   </Text>
      // </ImageBackground>
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
  return (
    // <ProtectedRoute>
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
          // borderRadius: 50,
          // marginHorizontal: 20,
          // marginBottom: 36,
          height: 52,
          position: "absolute",
          overflowX: "hidden",
          borderWidth: 1,
          // borderColor: "#0f0d73",
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
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.cart}
              title="Cart"
              customViewStyle="bg-primary-100 h-20 w-20 absolute -top-16 z-10 border-4 border-light-100 shadow-lg"
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
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.profile} title="Profile" />
          ),
        }}
      />
    </Tabs>
    // </ProtectedRoute>
  );
};

export default _layout;
