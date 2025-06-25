"use client";

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import HomeScreen from "@/app/(drawer)/(tabs)";
import LikedScreen from "@/app/(drawer)/(tabs)/liked";
import Cart from "@/app/(drawer)/(tabs)/cart";
import NotificationsScreen from "@/app/(drawer)/(tabs)/notifications";
import ProfileScreen from "@/app/(drawer)/(tabs)/profile";

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get("window");

// Enhanced Tab Bar Component with modern design
const ModernTabBar = ({ state, descriptors, navigation }) => {
  const [animatedValues] = React.useState(
    state.routes.map(() => new Animated.Value(0))
  );

  React.useEffect(() => {
    animatedValues.forEach((animValue, index) => {
      Animated.timing(animValue, {
        toValue: state.index === index ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  }, [state.index]);

  return (
    <View
      style={{
        position: "relative",
        backgroundColor: "transparent",
      }}
    >
      {/* Background with gradient and blur effect */}
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.98)", "rgba(248, 248, 248, 1)"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      />

      {/* Subtle top border */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 20,
          right: 20,
          height: 1,
          backgroundColor: "rgba(105, 17, 18, 0.1)",
          borderRadius: 1,
        }}
      />

      <View
        style={{
          paddingBottom: 12,
          paddingTop: 10,
          paddingHorizontal: 15, // Reduced from 20 to give more space
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between", // Changed from space-around to space-between
            alignItems: "center",
            position: "relative",
            paddingHorizontal: 10, // Add horizontal padding to prevent overflow
          }}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const isCartTab = route.name === "Cart";
            const animatedValue = animatedValues[index];

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            // Enhanced icon mapping with filled/outline variants
            const getIconName = (routeName: string, focused: boolean) => {
              switch (routeName) {
                case "Home":
                  return focused ? "home" : "home-outline";
                case "Pantry":
                  return focused ? "heart" : "heart-outline";
                case "Cart":
                  return "bag-handle";
                case "Notifications":
                  return focused ? "notifications" : "notifications-outline";
                case "Profile":
                  return focused ? "person" : "person-outline";
                default:
                  return "home-outline";
              }
            };

            const getTabLabel = (routeName: string) => {
              switch (routeName) {
                case "Home":
                  return "Home";
                case "Pantry":
                  return "Pantry";
                case "Cart":
                  return "Cart";
                case "Notifications":
                  return "Alerts";
                case "Profile":
                  return "Profile";
                default:
                  return routeName;
              }
            };

            // Cart tab (center, floating design)
            if (isCartTab) {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={onPress}
                  style={{
                    position: "relative",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: -5,
                  }}
                  activeOpacity={0.8}
                >
                  {/* Floating background with gradient */}
                  <LinearGradient
                    colors={["#691112", "#8B1538", "#691112"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 75,
                      height: 75,
                      borderRadius: 37.5,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={getIconName(route.name, true)}
                      size={30}
                      color="#ffffff"
                    />
                  </LinearGradient>

                  {/* Enhanced notification badge */}
                  <View
                    style={{
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
                    }}
                  >
                    <Text
                      style={{
                        color: "#ffffff",
                        fontSize: 12,
                        fontWeight: "800",
                        letterSpacing: 0.5,
                      }}
                    >
                      2
                    </Text>
                  </View>

                  {/* Floating effect rings */}
                  <Animated.View
                    style={{
                      position: "absolute",
                      width: 85,
                      height: 85,
                      borderRadius: 42.5,
                      borderWidth: 2,
                      borderColor: "rgba(105, 17, 18, 0.2)",
                      opacity: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                      transform: [
                        {
                          scale: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1],
                          }),
                        },
                      ],
                    }}
                  />
                </TouchableOpacity>
              );
            }

            // Regular tabs with enhanced design
            return (
              <TouchableOpacity
                key={index}
                onPress={onPress}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 4,
                  paddingHorizontal: 8, // Reduced from 12
                  minWidth: 55, // Reduced from 60
                  flex: 1, // Add flex to distribute space evenly
                  maxWidth: (width - 120) / 4, // Ensure tabs don't exceed available space
                }}
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
                          outputRange: [1, 1.1],
                        }),
                      },
                    ],
                  }}
                >
                  {/* Icon container with dynamic background */}
                  <Animated.View
                    style={{
                      width: 45, // Reduced from 50
                      height: 45, // Reduced from 50
                      borderRadius: 22.5,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["transparent", "rgba(105, 17, 18, 0.1)"],
                      }),
                      marginBottom: 2,
                    }}
                  >
                    <Ionicons
                      name={getIconName(route.name, isFocused)}
                      size={isFocused ? 24 : 22} // Reduced icon sizes
                      color={isFocused ? "#691112" : "#888888"}
                    />
                  </Animated.View>

                  {/* Tab label */}
                  <Animated.Text
                    style={{
                      fontSize: 10, // Reduced from 11
                      fontWeight: isFocused ? "700" : "500",
                      color: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["#888888", "#691112"],
                      }),
                      letterSpacing: 0.2, // Reduced from 0.3
                      textAlign: "center",
                    }}
                  >
                    {getTabLabel(route.name)}
                  </Animated.Text>

                  {/* Active indicator dot */}
                  <Animated.View
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: "#691112",
                      marginTop: 1,
                      opacity: animatedValue,
                      transform: [
                        {
                          scale: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                          }),
                        },
                      ],
                    }}
                  />
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default function ModernBottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <ModernTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home" component={() => <HomeScreen />} />
      <Tab.Screen name="Pantry" component={() => <LikedScreen />} />
      <Tab.Screen name="Cart" component={() => <Cart />} />
      <Tab.Screen
        name="Notifications"
        component={() => <NotificationsScreen />}
      />
      <Tab.Screen name="Profile" component={() => <ProfileScreen />} />
    </Tab.Navigator>
  );
}
