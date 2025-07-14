"use client";

import HomeScreen from "@/app/(drawer)/(tabs)";
import Cart from "@/app/(drawer)/(tabs)/cart";
import LikedScreen from "@/app/(drawer)/(tabs)/liked";
import NotificationsScreen from "@/app/(drawer)/(tabs)/notifications";
import ProfileScreen from "@/app/(drawer)/(tabs)/profile";
import { cartSelectors } from "@/store/reducers/cartSlice";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback, useMemo } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get("window");

// Pre-calculate static values
const TAB_WIDTH = (width - 120) / 4;
const CART_SIZE = 60;
const REGULAR_ICON_SIZE = 45;

// Static styles to prevent recreation
const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "transparent",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  topBorder: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: "rgba(105, 17, 18, 0.1)",
    borderRadius: 1,
  },
  tabContainer: {
    paddingBottom: Platform.select({
      ios: 30,
      android: 4,
    }),
    paddingTop: 10,

    paddingHorizontal: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    paddingHorizontal: 10,
  },
  cartTab: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -5,
  },
  cartGradient: {
    width: CART_SIZE,
    height: CART_SIZE,
    borderRadius: CART_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF6B6B",
    borderRadius: 14,
    minWidth: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  cartBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  regularTab: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 55,
    flex: 1,
    maxWidth: TAB_WIDTH,
  },
  iconContainer: {
    width: REGULAR_ICON_SIZE,
    height: REGULAR_ICON_SIZE,
    borderRadius: REGULAR_ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#691112",
    marginTop: 1,
  },
});

// Icon mapping - moved outside component to prevent recreation
const ICON_MAP = {
  Home: { focused: "home", unfocused: "home-outline" },
  Pantry: { focused: "heart", unfocused: "heart-outline" },
  Cart: { focused: "bag-handle", unfocused: "bag-handle" },
  Notifications: {
    focused: "notifications",
    unfocused: "notifications-outline",
  },
  Profile: { focused: "person", unfocused: "person-outline" },
};

const LABEL_MAP = {
  Home: "Home",
  Pantry: "Pantry",
  Cart: "Cart",
  Notifications: "Alerts",
  Profile: "Profile",
};

// Memoized Cart Tab Component
const CartTab = memo(({ onPress, animatedValue }) => {
  const finalizedCartItems = useSelector(cartSelectors.getFinalizedCartItems);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.cartTab}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={["#691112", "#8B1538", "#691112"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cartGradient}
      >
        <Ionicons name="bag-handle" size={20} color="#ffffff" />
      </LinearGradient>
      {finalizedCartItems.length !== 0 && (
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{finalizedCartItems.length}</Text>
        </View>
      )}

      {/* Simplified floating effect - only when focused */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 70,
            height: 70,
            borderRadius: 42.5,
            borderWidth: 2,
            borderColor: "rgba(105, 17, 18, 0.2)",
          },
          {
            opacity: animatedValue,
            transform: [
              {
                scale: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      />
    </TouchableOpacity>
  );
});

// Memoized Regular Tab Component
const RegularTab = memo(({ route, isFocused, onPress, animatedValue }) => {
  const iconName =
    ICON_MAP[route.name]?.[isFocused ? "focused" : "unfocused"] ||
    "home-outline";
  const label = LABEL_MAP[route.name] || route.name;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.regularTab}
      activeOpacity={0.7}
    >
      <Animated.View
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.05], // Reduced scale for performance
              }),
            },
          ],
        }}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            {
              backgroundColor: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ["transparent", "rgba(105, 17, 18, 0.1)"],
              }),
            },
          ]}
        >
          <Ionicons
            name={iconName}
            size={isFocused ? 24 : 22}
            color={isFocused ? "#691112" : "#888888"}
          />
        </Animated.View>

        {/* <Animated.Text
          style={[
            styles.tabLabel,
            {
              fontWeight: isFocused ? "700" : "500",
              color: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ["#888888", "#691112"],
              }),
            },
          ]}
        >
          {label}
        </Animated.Text> */}

        <Animated.View
          style={[
            styles.activeIndicator,
            {
              opacity: animatedValue,
              transform: [
                {
                  scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
});

// Enhanced Tab Bar Component with optimizations
const ModernTabBar = memo(({ state, descriptors, navigation }) => {
  // Memoize animated values to prevent recreation
  const animatedValues = useMemo(
    () => state.routes.map(() => new Animated.Value(0)),
    [state.routes.length]
  );

  // Optimize animations with reduced duration and native driver where possible
  React.useEffect(() => {
    const animations = animatedValues.map((animValue, index) =>
      Animated.timing(animValue, {
        toValue: state.index === index ? 1 : 0,
        duration: 150, // Reduced from 200ms
        useNativeDriver: false, // Keep false for color interpolations
      })
    );

    // Run animations in parallel for better performance
    Animated.parallel(animations).start();
  }, [state.index, animatedValues]);

  // Memoize tab press handlers
  const createTabPressHandler = useCallback(
    (route, isFocused) => () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    },
    [navigation]
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.98)", "rgba(248, 248, 248, 1)"]}
        style={styles.gradientBackground}
      />

      <View style={styles.topBorder} />

      <View style={styles.tabContainer}>
        <View style={styles.tabRow}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const isCartTab = route.name === "Cart";
            const animatedValue = animatedValues[index];
            const onPress = createTabPressHandler(route, isFocused);

            if (isCartTab) {
              return (
                <CartTab
                  key={route.key}
                  onPress={onPress}
                  animatedValue={animatedValue}
                />
              );
            }

            return (
              <RegularTab
                key={route.key}
                route={route}
                isFocused={isFocused}
                onPress={onPress}
                animatedValue={animatedValue}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
});

// Memoized screen components to prevent unnecessary re-renders
const MemoizedHomeScreen = memo(() => <HomeScreen />);
const MemoizedLikedScreen = memo(() => <LikedScreen />);
const MemoizedCart = memo(() => <Cart />);
const MemoizedNotificationsScreen = memo(() => <NotificationsScreen />);
const MemoizedProfileScreen = memo(() => <ProfileScreen />);

export default function ModernBottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <ModernTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        lazy: true,
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName="Home"
      // Optimize screen options
      sceneContainerStyle={{ backgroundColor: "transparent" }}
    >
      <Tab.Screen
        name="Home"
        component={MemoizedHomeScreen}
        options={{ lazy: true }}
      />
      <Tab.Screen
        name="Pantry"
        component={MemoizedLikedScreen}
        options={{ lazy: true }}
      />
      <Tab.Screen
        name="Cart"
        component={MemoizedCart}
        options={{ lazy: false }} // Keep cart always loaded for quick access
      />
      <Tab.Screen
        name="Notifications"
        component={MemoizedNotificationsScreen}
        options={{ lazy: true }}
      />
      <Tab.Screen
        name="Profile"
        component={MemoizedProfileScreen}
        options={{ lazy: true }}
      />
    </Tab.Navigator>
  );
}
