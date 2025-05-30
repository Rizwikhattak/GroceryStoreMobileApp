"use client";

import { View, Image, Pressable, StyleSheet, Dimensions } from "react-native";
import { Tabs } from "expo-router";
import { icons } from "@/constants/icons";
import { primary } from "@/constants/colors";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth } = Dimensions.get("window");

const TabIcon = ({
  focused,
  icon,
  title,
  customViewStyle = null,
  customIconStyle = null,
  customTintColor = "#9CA3AF",
}: any) => {
  if (title === "Cart") {
    return (
      <View style={styles.cartContainer}>
        <View style={styles.cartButton}>
          <LinearGradient
            colors={[primary, `${primary}DD`]}
            style={styles.cartGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Image source={icon} tintColor="#ffffff" style={styles.cartIcon} />
          </LinearGradient>
        </View>
        {focused && (
          <View style={[styles.cartIndicator, { backgroundColor: primary }]} />
        )}
      </View>
    );
  }

  return (
    <View style={styles.tabIconContainer}>
      {focused && (
        <View
          style={[styles.activeBackground, { backgroundColor: `${primary}15` }]}
        />
      )}
      <Image
        source={icon}
        tintColor={focused ? primary : customTintColor}
        style={[styles.icon, customIconStyle && styles[customIconStyle]]}
      />
      {focused && (
        <View style={[styles.activeDot, { backgroundColor: primary }]} />
      )}
    </View>
  );
};

const EnhancedTabBar = () => {
  return (
    <>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <View style={styles.tabBarWrapper}>
        <View style={styles.tabBarBackground}>
          <LinearGradient
            colors={["#FFFFFF", "#F8FAFC"]}
            style={styles.backgroundGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </View>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,
            tabBarStyle: styles.tabBar,
            tabBarButton: (props) => (
              <Pressable
                {...props}
                android_ripple={{ color: `${primary}20`, borderless: true }}
                style={styles.pressableArea}
              />
            ),
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon focused={focused} icon={icons.home} title="Home" />
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
            name="cart"
            options={{
              title: "Cart",
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon focused={focused} icon={icons.cart} title="Cart" />
              ),
            }}
          />
          <Tabs.Screen
            name="notifications"
            options={{
              title: "Notification",
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  focused={focused}
                  icon={icons.bell}
                  title="Notification"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  focused={focused}
                  icon={icons.profile}
                  title="Profile"
                />
              ),
            }}
          />
        </Tabs>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 90, // Space for the enhanced tab bar
  },
  tabBarWrapper: {
    position: "absolute",
    height: "100%",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  tabBarBackground: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    elevation: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  backgroundGradient: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: "#ffff",
    height: 75,
    position: "absolute",
    bottom: 0,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  pressableArea: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  tabIconContainer: {
    width: 55,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 27.5,
    position: "relative",
  },
  activeBackground: {
    position: "absolute",
    width: 55,
    height: 55,
    borderRadius: 27.5,
    zIndex: -1,
  },
  icon: {
    width: 24,
    height: 24,
  },
  activeDot: {
    position: "absolute",
    bottom: -8,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cartContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cartButton: {
    width: 65,
    height: 65,
    borderRadius: 37.5,
    // marginTop: -25,
    marginTop: 0,
    elevation: 20,
    shadowColor: primary,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  cartGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 37.5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "#ffffff",
  },
  cartIcon: {
    width: 25,
    height: 25,
  },
  cartIndicator: {
    position: "absolute",
    bottom: -15,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default EnhancedTabBar;
