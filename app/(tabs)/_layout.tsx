import React, { useRef, useCallback, useState } from "react";
import {
  View,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
  Text,
  Animated,
} from "react-native";
import { Tabs, useRouter, useSegments } from "expo-router";
import { icons } from "@/constants/icons";
import { primary } from "@/constants/colors";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const { width: screenWidth } = Dimensions.get("window");

// Define your tab routes in order
const TAB_ROUTES = ["index", "liked", "cart", "notifications", "profile"];

const TabIcon = ({ focused, icon, title, animatedScale }) => {
  // Get cart data from Redux store
  const cart = useSelector((state) => state.cart);

  // Calculate total items in cart
  const cartItemCount =
    cart?.data?.reduce((total, item) => {
      return total + (item?.orderQuantity || 0);
    }, 0) || 0;

  if (title === "Cart") {
    return (
      <Animated.View
        style={[
          styles.cartContainer,
          { transform: [{ scale: animatedScale }] },
        ]}
      >
        <View style={styles.cartButton}>
          <LinearGradient
            colors={[primary, `${primary}DD`]}
            style={styles.cartGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Image source={icon} tintColor="#ffffff" style={styles.cartIcon} />
          </LinearGradient>

          {/* Cart Count Badge */}
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cartItemCount > 99 ? "99+" : cartItemCount.toString()}
              </Text>
            </View>
          )}
        </View>
        {focused && (
          <View style={[styles.cartIndicator, { backgroundColor: primary }]} />
        )}
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.tabIconContainer,
        { transform: [{ scale: animatedScale }] },
      ]}
    >
      {focused && (
        <View
          style={[styles.activeBackground, { backgroundColor: `${primary}15` }]}
        />
      )}
      <Image
        source={icon}
        tintColor={focused ? primary : "#9CA3AF"}
        style={styles.icon}
      />
      {focused && (
        <View style={[styles.activeDot, { backgroundColor: primary }]} />
      )}
    </Animated.View>
  );
};

const SwipeableTabWrapper = ({ children }) => {
  const router = useRouter();
  const segments = useSegments();
  const [isGestureActive, setIsGestureActive] = useState(false);

  // Simplified animation values
  const swipeTranslation = useRef(new Animated.Value(0)).current;
  const tabScaleAnimations = useRef(
    TAB_ROUTES.map(() => new Animated.Value(1))
  ).current;

  // Get current tab index
  const getCurrentTabIndex = useCallback(() => {
    const currentRoute = segments[segments.length - 1] || "index";
    const index = TAB_ROUTES.indexOf(currentRoute);
    return index === -1 ? 0 : index;
  }, [segments]);

  const navigateToTab = useCallback(
    (targetIndex) => {
      if (targetIndex >= 0 && targetIndex < TAB_ROUTES.length) {
        const targetRoute = TAB_ROUTES[targetIndex];
        const currentIndex = getCurrentTabIndex();

        // Simple scale animation for feedback
        Animated.sequence([
          Animated.timing(tabScaleAnimations[targetIndex], {
            toValue: 1.2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(tabScaleAnimations[targetIndex], {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();

        // Navigate
        try {
          if (targetRoute === "index") {
            router.push("/(tabs)/");
          } else {
            router.push(`/(tabs)/${targetRoute}`);
          }
        } catch (error) {
          console.log("Navigation error:", error);
          try {
            router.replace(`/(tabs)/${targetRoute}`);
          } catch (fallbackError) {
            console.log("Fallback navigation failed:", fallbackError);
          }
        }
      }
    },
    [router, getCurrentTabIndex, tabScaleAnimations]
  );

  const onGestureEvent = useCallback(
    (event) => {
      const { translationX } = event.nativeEvent;

      // Simple translation update
      swipeTranslation.setValue(translationX);

      // Set gesture active state
      if (Math.abs(translationX) > 20 && !isGestureActive) {
        setIsGestureActive(true);
      }
    },
    [isGestureActive, swipeTranslation]
  );

  const onHandlerStateChange = useCallback(
    (event) => {
      const { state, translationX, velocityX } = event.nativeEvent;

      if (state === State.BEGAN) {
        setIsGestureActive(true);
      }

      if (state === State.END || state === State.CANCELLED) {
        setIsGestureActive(false);

        // Reset swipe translation
        Animated.spring(swipeTranslation, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start();

        if (state === State.END) {
          const currentIndex = getCurrentTabIndex();
          const swipeThreshold = screenWidth * 0.2;
          const velocityThreshold = 800;

          let targetIndex = currentIndex;

          // Determine navigation based on swipe
          if (translationX > swipeThreshold || velocityX > velocityThreshold) {
            // Swipe right - go to previous tab
            targetIndex = Math.max(0, currentIndex - 1);
          } else if (
            translationX < -swipeThreshold ||
            velocityX < -velocityThreshold
          ) {
            // Swipe left - go to next tab
            targetIndex = Math.min(TAB_ROUTES.length - 1, currentIndex + 1);
          }

          if (targetIndex !== currentIndex) {
            navigateToTab(targetIndex);
          }
        }
      }
    },
    [getCurrentTabIndex, navigateToTab, swipeTranslation]
  );

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      activeOffsetX={[-15, 15]}
      failOffsetY={[-50, 50]}
      shouldCancelWhenOutside={false}
      enabled={true}
    >
      <View style={{ flex: 1 }}>
        {/* Content with simple swipe feedback */}
        <Animated.View
          style={[
            { flex: 1 },
            {
              transform: [
                {
                  translateX: swipeTranslation.interpolate({
                    inputRange: [-screenWidth, screenWidth],
                    outputRange: [-50, 50],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          ]}
        >
          {children}
        </Animated.View>

        {/* Simple swipe indicator */}
        {isGestureActive && (
          <Animated.View
            style={[
              styles.swipeIndicator,
              {
                opacity: swipeTranslation.interpolate({
                  inputRange: [-100, 0, 100],
                  outputRange: [0.8, 0, 0.8],
                  extrapolate: "clamp",
                }),
                transform: [
                  {
                    translateX: swipeTranslation.interpolate({
                      inputRange: [-screenWidth, screenWidth],
                      outputRange: [-100, 100],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.swipeIndicatorDot} />
          </Animated.View>
        )}

        {/* Simple directional arrows */}
        {isGestureActive && (
          <>
            <Animated.View
              style={[
                styles.swipeArrowLeft,
                {
                  opacity: swipeTranslation.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0, 1],
                    extrapolate: "clamp",
                  }),
                },
              ]}
            >
              <Text style={styles.swipeArrowText}>←</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.swipeArrowRight,
                {
                  opacity: swipeTranslation.interpolate({
                    inputRange: [-50, 0],
                    outputRange: [1, 0],
                    extrapolate: "clamp",
                  }),
                },
              ]}
            >
              <Text style={styles.swipeArrowText}>→</Text>
            </Animated.View>
          </>
        )}
      </View>
    </PanGestureHandler>
  );
};

const SwipeableTabBar = () => {
  const tabScaleAnimations = useRef(
    TAB_ROUTES.map(() => new Animated.Value(1))
  ).current;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <SwipeableTabWrapper>
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
                  <TabIcon
                    focused={focused}
                    icon={icons.home}
                    title="Home"
                    animatedScale={tabScaleAnimations[0]}
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
                  <TabIcon
                    focused={focused}
                    icon={icons.heart}
                    title="Liked"
                    animatedScale={tabScaleAnimations[1]}
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
                    animatedScale={tabScaleAnimations[2]}
                  />
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
                    animatedScale={tabScaleAnimations[3]}
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
                    animatedScale={tabScaleAnimations[4]}
                  />
                ),
              }}
            />
          </Tabs>
        </View>
      </SwipeableTabWrapper>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "#ffffff",
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
    marginTop: 0,
    elevation: 20,
    shadowColor: primary,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    position: "relative",
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
  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF4757",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: "#ffffff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cartBadgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  // Simplified swipe indicator
  swipeIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 60,
    height: 60,
    marginLeft: -30,
    marginTop: -30,
    borderRadius: 30,
    backgroundColor: "rgba(139, 21, 56, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  swipeIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: primary,
  },
  // Simple directional arrows
  swipeArrowLeft: {
    position: "absolute",
    left: 30,
    top: "45%",
    zIndex: 998,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  swipeArrowRight: {
    position: "absolute",
    right: 30,
    top: "45%",
    zIndex: 998,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  swipeArrowText: {
    fontSize: 20,
    color: primary,
    fontWeight: "bold",
  },
});

export default SwipeableTabBar;
