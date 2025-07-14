import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

interface SimpleLoadingProps {
  size?: "small" | "large";
  color?: string;
  message?: string;
  transparent?: boolean;
}

const LoadingScreen: React.FC<SimpleLoadingProps> = ({
  size = "large",
  color = "#8B1538",
  message = "Loading...",
  transparent = false,
}) => {
  const fadeValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: transparent ? "rgba(0, 0, 0, 0.5)" : "white",
          opacity: fadeValue,
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <View style={styles.content}>
        <ActivityIndicator size={size} color={color} style={styles.spinner} />
        <Text style={[styles.message, { color }]}>{message}</Text>
      </View>
    </Animated.View>
  );
};

// Inline loading for buttons or small components
interface InlineLoadingProps {
  size?: number;
  color?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  size = 20,
  color = "white",
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    return () => spinAnimation.stop();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: `${color}30`,
          borderTopColor: color,
        },
        { transform: [{ rotate: spin }] },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  content: {
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  spinner: {
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default LoadingScreen;
