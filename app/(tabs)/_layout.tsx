"use client";

import {
  View,
  Image,
  Pressable,
  Keyboard,
  Platform,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { useEffect, useState, useRef } from "react";
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
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.9)).current;
  const translateYAnim = useRef(new Animated.Value(focused ? -2 : 0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          useNativeDriver: true,
          tension: 250,
          friction: 6,
        }),
        Animated.spring(translateYAnim, {
          toValue: -4,
          useNativeDriver: true,
          tension: 250,
          friction: 6,
        }),
      ]).start();

      // Pulse animation for cart
      if (title === "Cart") {
        const pulse = () => {
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.05,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ]).start(() => pulse());
        };
        pulse();
      }
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          useNativeDriver: true,
          tension: 250,
          friction: 6,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 250,
          friction: 6,
        }),
      ]).start();
    }
  }, [focused]);

  if (title === "Cart") {
    return (
      <View style={styles.cartContainer}>
        <Animated.View
          style={[
            styles.cartButton,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[primary, `${primary}DD`]}
            style={styles.cartGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.View
              style={{
                transform: [
                  { scale: scaleAnim },
                  { translateY: translateYAnim },
                ],
              }}
            >
              <Image
                source={icon}
                tintColor="#ffffff"
                style={styles.cartIcon}
              />
            </Animated.View>
          </LinearGradient>
        </Animated.View>
        {focused && (
          <Animated.View
            style={[styles.cartIndicator, { backgroundColor: primary }]}
          />
        )}
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.tabIconContainer,
        {
          transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
        },
      ]}
    >
      {focused && (
        <Animated.View
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
    </Animated.View>
  );
};

const EnhancedTabBar = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 100,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(backgroundAnim, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
        ]).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(backgroundAnim, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          }),
        ]).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      tension: 300,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 8,
    }).start();
  };

  return (
    <>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <Animated.View
        style={[
          styles.tabBarWrapper,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
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
            tabBarShowLabel: false,
            tabBarItemStyle: styles.tabBarItem,
            tabBarButton: (props) => (
              <Animated.View style={{ transform: [{ scale: pressAnim }] }}>
                <Pressable
                  {...props}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  android_ripple={{ color: `${primary}20`, borderless: true }}
                  style={styles.pressableArea}
                />
              </Animated.View>
            ),
            tabBarStyle: styles.tabBar,
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
      </Animated.View>
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
    width: 75,
    height: 75,
    borderRadius: 37.5,
    marginTop: -25,
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
    width: 30,
    height: 30,
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
